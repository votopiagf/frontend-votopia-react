import { useState, useEffect, useMemo, useCallback } from 'react';
import userService from '@/test/services/users.service.ts';
import type { UserSummary, UserDetail } from '@/test/types/user.types.ts';
import type { RoleSummary } from '@/test/types/role.types.ts';
import type { ListSummary } from '@/test/types/list.types.ts';
import type {
    UsersScreenInitDto,
    ListOptionDto,
    RoleOptionDto
} from '@/test/types/dtos/user.dto.ts';
import { isDev } from '@/test/lib/env.ts';

// ============================================================================
// TIPI INTERNI PER LA UI
// ============================================================================

export interface UserUI {
    id: string;
    name: string;
    surname: string;
    email: string;
    displayName: string;
    initials: string;
    roles: RoleSummary[];
    lists: ListSummary[];
}

export interface UserFormData {
    name: string;
    surname: string;
    email: string;
    rolesId: number[];
    listsId: number[];
}

// ============================================================================
// HELPERS
// ============================================================================

export const getDisplayName = (user: UserUI | null): string => {
    if (!user) return '';
    if (user.displayName) return user.displayName;
    const full = `${user.name ?? ''} ${user.surname ?? ''}`.trim();
    return full || user.email || '';
};

export const getInitials = (user: UserUI | null): string => {
    if (!user) return '';
    if (user.initials) return user.initials;
    const name = getDisplayName(user);
    if (!name) return '';
    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const rolesToString = (roles: RoleSummary[] | null | undefined): string => {
    if (!roles || !Array.isArray(roles)) return '';
    return roles.map(r => r.name).filter(Boolean).join(', ');
};

export const listsToString = (lists: ListSummary[] | null | undefined): string => {
    if (!lists || !Array.isArray(lists)) return '';
    return lists.map(l => l.name).filter(Boolean).join(', ');
};

// Normalizza dati dal backend al formato UI
const normalizeUser = (raw: UserSummary | UserDetail): UserUI => {
    const name = raw.name ?? '';
    const surname = raw.surname ?? '';
    const displayName = `${name} ${surname}`.trim() || raw.email || '';

    const parts = displayName.split(/\s+/);
    const initials = parts.length === 1
        ? parts[0].charAt(0).toUpperCase()
        : (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();

    return {
        id: String(raw.id),
        name,
        surname,
        email: raw.email,
        displayName,
        initials,
        roles: Array.isArray(raw.roles) ? raw.roles : [],
        lists: 'list' in raw && Array.isArray(raw.list) ? raw.list : [],
    };
};

// ============================================================================
// HOOK PRINCIPALE
// ============================================================================

interface UseUsersReturn {
    // Data
    users: UserUI[];
    filteredUsers: UserUI[];
    selectedUser: UserUI | null;
    loading: boolean;
    actionLoading: boolean;

    // Initialization data
    screenInitData: UsersScreenInitDto | null;
    availableLists: ListOptionDto[];
    availableOrgRoles: RoleOptionDto[];
    availableListRoles: RoleOptionDto[];

    // Selection
    selectedUserId: string | null;
    setSelectedUserId: (id: string | null) => void;

    // Search & Filters
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    selectedRoleId: number | null;
    setSelectedRoleId: (id: number | null) => void;
    selectedListId: number | null;
    setSelectedListId: (id: number | null) => void;

    // Actions
    fetchUsers: () => Promise<void>;
    fetchScreenInitialization: () => Promise<void>;
    getAssignableRolesForList: (listId?: number) => Promise<RoleOptionDto[]>;
    createUser: (data: UserFormData) => Promise<UserUI | null>;
    createUsers: (dataList: UserFormData[]) => Promise<UserUI[]>;
    updateUser: (id: string, data: Partial<UserFormData>) => Promise<UserUI | null>;
    updateUsers: (updates: { id: string; data: Partial<UserFormData> }[]) => Promise<UserUI[]>;
    deleteUser: (id: string) => Promise<boolean>;
    deleteUsers: (ids: string[]) => Promise<boolean>;
    resetPassword: (id: string) => Promise<boolean>;
    downloadExcel: () => Promise<void>;
}

export function useUsers(): UseUsersReturn {
    const [users, setUsers] = useState<UserUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialization data
    const [screenInitData, setScreenInitData] = useState<UsersScreenInitDto | null>(null);
    const [availableLists, setAvailableLists] = useState<ListOptionDto[]>([]);
    const [availableOrgRoles, setAvailableOrgRoles] = useState<RoleOptionDto[]>([]);
    const [availableListRoles, setAvailableListRoles] = useState<RoleOptionDto[]>([]);

    // helper: current user id from localStorage
    const getCurrentUserId = (): string | null => {
        try {
            const raw = localStorage.getItem('user');
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed?.id ? String(parsed.id) : null;
        } catch {
            return null;
        }
    };

    // Fetch screen initialization data
    const fetchScreenInitialization = useCallback(async () => {
        try {
            setError(null);
            const data = await userService.getUsersScreenInitialization(selectedListId ?? undefined);
            if (isDev()) {
                console.log('screenInitData:', data);
            }
            setScreenInitData(data);
            setAvailableLists(data?.availableLists ?? []);
            setAvailableOrgRoles(data?.availableOrgRoles ?? []);
            setAvailableListRoles(data?.availableListRoles ?? []);
        } catch (e: any) {
            console.error('Errore fetch inizializzazione schermata:', e);
            setError(e?.message || String(e));
        }
    }, [selectedListId]);

    // Get assignable roles for a specific list
    const getAssignableRolesForList = useCallback(async (listId?: number): Promise<RoleOptionDto[]> => {
        try {
            return await userService.getAssignableRoles(listId);
        } catch (e) {
            console.error('Errore fetch ruoli assegnabili:', e);
            return [];
        }
    }, []);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            setError(null);
            const data = await userService.getAll(selectedListId ?? undefined);
            if (isDev()) {
                console.log('users fetched:', data.length, 'selectedListId:', selectedListId);
            }
            const normalized = data.map(normalizeUser);

            // Escludi l'utente corrente
            const currentId = getCurrentUserId();
            const filtered = currentId ? normalized.filter(u => u.id !== currentId) : normalized;

            setUsers(filtered);
            if (!selectedUserId && filtered.length > 0) {
                setSelectedUserId(filtered[0].id);
            }
        } catch (e: any) {
            console.error('Errore fetch utenti:', e);
            setError(e?.message || String(e));
        } finally {
            setLoading(false);
        }
    }, [selectedListId, selectedUserId]);

    // Initial fetch
    useEffect(() => {
        fetchScreenInitialization();
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchScreenInitialization();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedListId]);

    // Re-fetch screen initialization when filter changes
    useEffect(() => {
        if (selectedListId) {
            console.log('🔄 Filtro lista cambiato, ricarico dati schermata...');
            fetchScreenInitialization();
        }
    }, [selectedListId, fetchScreenInitialization]);

    // Filtered users
    const filteredUsers = useMemo(() => {
        let result = users;

        // Filtro per ricerca testuale
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(u =>
                u.displayName.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
        }

        // Filtro per ruolo
        if (selectedRoleId !== null) {
            result = result.filter(u =>
                u.roles.some(r => r.id === selectedRoleId)
            );
        }

        // Filtro per lista
        if (selectedListId !== null) {
            result = result.filter(u =>
                u.lists.some(l => l.id === selectedListId)
            );
        }

        return result;
    }, [users, searchQuery, selectedRoleId, selectedListId]);

    // Selected user
    const selectedUser = useMemo(() => {
        if (!selectedUserId) return users[0] ?? null;
        return users.find(u => u.id === selectedUserId) ?? null;
    }, [users, selectedUserId]);

    // Create single user
    const createUser = useCallback(async (data: UserFormData): Promise<UserUI | null> => {
        setActionLoading(true);
        try {
            const created = await userService.register({
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: 'tempPassword123', // Backend dovrebbe gestirlo
                rolesId: data.rolesId,
                listsId: data.listsId,
            });
            const normalized = normalizeUser(created);
            setUsers(prev => [normalized, ...prev]);
            setSelectedUserId(normalized.id);
            return normalized;
        } catch (e) {
            console.error('Errore creazione utente:', e);
            return null;
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Create multiple users
    const createUsers = useCallback(async (dataList: UserFormData[]): Promise<UserUI[]> => {
        setActionLoading(true);
        try {
            const payloads = dataList.map(data => ({
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: 'tempPassword123',
                rolesId: data.rolesId,
                listsId: data.listsId,
            }));
            const created = await userService.registerMany(payloads);
            const normalized = created.map(normalizeUser);
            setUsers(prev => [...normalized, ...prev]);
            if (normalized.length > 0) {
                setSelectedUserId(normalized[0].id);
            }
            return normalized;
        } catch (e) {
            console.error('Errore creazione utenti:', e);
            return [];
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Update single user
    const updateUser = useCallback(async (id: string, data: Partial<UserFormData>): Promise<UserUI | null> => {
        setActionLoading(true);
        try {
            const payload = {
                id: Number(id),
                name: data.name,
                surname: data.surname,
                email: data.email,
                addLists: data.listsId,
                rolesId: data.rolesId, // Aggiungo i ruoli
            };
            const updated = await userService.update(payload);
            const normalized = normalizeUser(updated);
            setUsers(prev => prev.map(u => u.id === id ? normalized : u));
            return normalized;
        } catch (e) {
            console.error('Errore aggiornamento utente:', e);
            return null;
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Update multiple users
    const updateUsers = useCallback(async (updates: { id: string; data: Partial<UserFormData> }[]): Promise<UserUI[]> => {
        setActionLoading(true);
        try {
            const payloads = updates.map(({ id, data }) => ({
                id: Number(id),
                name: data.name,
                surname: data.surname,
                email: data.email,
                addLists: data.listsId,
            }));
            const updated = await userService.updateMany(payloads);
            const normalized = updated.map(normalizeUser);
            setUsers(prev => prev.map(u => {
                const found = normalized.find(n => n.id === u.id);
                return found ?? u;
            }));
            return normalized;
        } catch (e) {
            console.error('Errore aggiornamento utenti:', e);
            return [];
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Delete single user
    const deleteUser = useCallback(async (id: string): Promise<boolean> => {
        setActionLoading(true);
        try {
            await userService.delete(Number(id));
            setUsers(prev => {
                const next = prev.filter(u => u.id !== id);
                // Update selection if deleted user was selected
                if (selectedUserId === id) {
                    setSelectedUserId(next.length > 0 ? next[0].id : null);
                }
                return next;
            });
            return true;
        } catch (e) {
            console.error('Errore eliminazione utente:', e);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [selectedUserId]);

    // Delete multiple users
    const deleteUsers = useCallback(async (ids: string[]): Promise<boolean> => {
        if (ids.length === 0) return false;
        setActionLoading(true);
        try {
            await userService.deleteMany(ids.map(Number));
            setUsers(prev => {
                const next = prev.filter(u => !ids.includes(u.id));
                // Update selection if selected user was deleted
                if (selectedUserId && ids.includes(selectedUserId)) {
                    setSelectedUserId(next.length > 0 ? next[0].id : null);
                }
                return next;
            });
            return true;
        } catch (e) {
            console.error('Errore eliminazione utenti:', e);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [selectedUserId]);

    // Reset password
    const resetPassword = useCallback(async (id: string): Promise<boolean> => {
        setActionLoading(true);
        try {
            await userService.update({ id: Number(id), resetPassword: true });
            return true;
        } catch (e) {
            console.error('Errore reset password:', e);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Download Excel
    const downloadExcel = useCallback(async (): Promise<void> => {
        setActionLoading(true);
        try {
            await userService.downloadExcel();
        } catch (e) {
            console.error('Errore download Excel:', e);
        } finally {
            setActionLoading(false);
        }
    }, []);

    return {
        users,
        filteredUsers,
        selectedUser,
        loading,
        actionLoading,
        screenInitData,
        availableLists,
        availableOrgRoles,
        availableListRoles,
        selectedUserId,
        setSelectedUserId,
        searchQuery,
        setSearchQuery,
        selectedRoleId,
        setSelectedRoleId,
        selectedListId,
        setSelectedListId,
        fetchUsers,
        fetchScreenInitialization,
        getAssignableRolesForList,
        createUser,
        createUsers,
        updateUser,
        updateUsers,
        deleteUser,
        deleteUsers,
        resetPassword,
        downloadExcel,
        error,
    };
}
