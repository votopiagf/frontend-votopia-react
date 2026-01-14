import { useState, useEffect, useMemo, useCallback } from 'react';
import rolesService, { type RoleInfoResponse, type RolesScreenInitDto } from '@/test/services/roles.service.ts';
import type { RoleCreate, RoleUpdate, RoleDetail, RoleSummary } from '@/test/types/role.types.ts';
import type { RoleSummaryDto, RoleDetailDto } from '@/test/types/dtos/role.dto.ts';
import type { ListSummary } from '@/test/types/list.types.ts';

// ============================================================================
// TIPI INTERNI PER LA UI
// ============================================================================

export interface RoleUI {
    id: string;
    name: string;
    color: string;
    level: number;
    list: ListSummary | null;
    initials: string;
}

export interface RoleFormData {
    name: string;
    color: string;
    level: number;
    listId?: number;
    permissionsId?: number[];
}

// Small helper per estrarre il messaggio d'errore dal backend/axios
const getErrorMessage = (err: unknown): string => {
    const anyErr = err as { response?: { data?: { message?: string } }; message?: string };
    return anyErr?.response?.data?.message || anyErr?.message || 'Errore imprevisto';
};

// ============================================================================
// HELPERS
// ============================================================================

// Helper per etichetta tipo ruolo
export const getRoleTypeLabel = (role: RoleUI | null): string => {
    if (!role) return '';
    return role.list ? `Lista: ${role.list.name}` : 'Organizzazione';
};

// Normalizza dati dal backend al formato UI
const normalizeRole = (raw: RoleDetailDto | RoleSummaryDto | RoleDetail | RoleSummary): RoleUI => {
    // Gestione list opzionale nei summary
    const list = (raw as RoleDetail | RoleSummary | RoleDetailDto | RoleSummaryDto).list ?? null;
    const color = (raw as RoleDetail | RoleDetailDto).color || (raw as RoleSummary | RoleSummaryDto).color || '#336900';
    const level = (raw as RoleDetail | RoleDetailDto).level ?? 0;
    return {
        id: String((raw as any).id),
        name: (raw as any).name,
        color,
        level,
        list: list as ListSummary | null,
        initials: ((raw as any).name || '').slice(0, 2).toUpperCase(),
    };
};

// ============================================================================
// HOOK PRINCIPALE
// ============================================================================

interface UseRolesReturn {
    // Data
    roles: RoleUI[];
    filteredRoles: RoleUI[];
    selectedRole: RoleUI | null;
    selectedRoleDetail: RoleInfoResponse | null;
    lists: ListSummary[];
    loading: boolean;
    actionLoading: boolean;
    error: string | null;

    // Selection
    selectedRoleId: string | null;
    setSelectedRoleId: (id: string | null) => void;

    // Filters
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    filterType: 'all' | 'org' | 'list';
    setFilterType: (type: 'all' | 'org' | 'list') => void;

    // Actions
    fetchRoles: () => Promise<void>;
    fetchRoleDetail: (id: string) => Promise<RoleInfoResponse | null>;
    createRole: (data: RoleFormData) => Promise<RoleUI | null>;
    updateRole: (id: string, data: Partial<RoleFormData>) => Promise<RoleUI | null>;
    deleteRole: (id: string) => Promise<boolean>;
}

export function useRoles(): UseRolesReturn {
    const [roles, setRoles] = useState<RoleUI[]>([]);
    const [lists, setLists] = useState<ListSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [selectedRoleDetail, setSelectedRoleDetail] = useState<RoleInfoResponse | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'org' | 'list'>('all');
    const [error, setError] = useState<string | null>(null);

    // Fetch roles and lists via init-screen
    const fetchRoles = useCallback(async () => {
        setLoading(true);
        try {
            setError(null);
            const init: RolesScreenInitDto = await rolesService.getRolesScreenInitialization();
            const orgRoles = (init.availableOrgRoles || []).map(normalizeRole);
            const listRoles = (init.availableListRoles || []).map(normalizeRole);
            const normalized = [...orgRoles, ...listRoles];
            setRoles(normalized);

            // Fetch lists separatamente (non bloccante)
            try {
                const listsData = await rolesService.getLists();
                setLists(listsData);
            } catch (_err) {
                setLists([]);
            }

            if (!selectedRoleId && normalized.length > 0) {
                setSelectedRoleId(normalized[0].id);
            }
        } catch (err) {
            console.error('Errore fetch ruoli:', err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [selectedRoleId]);

    // Fetch role detail
    const fetchRoleDetail = useCallback(async (id: string): Promise<RoleInfoResponse | null> => {
        try {
            const detail = await rolesService.getInfo(Number(id));
            setSelectedRoleDetail(detail);
            return detail;
        } catch (e) {
            console.error('Errore fetch dettaglio ruolo:', e);
            setError(getErrorMessage(e));
            return null;
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch detail when selection changes
    useEffect(() => {
        if (selectedRoleId) {
            fetchRoleDetail(selectedRoleId);
        } else {
            setSelectedRoleDetail(null);
        }
    }, [selectedRoleId, fetchRoleDetail]);

    // Filtered roles
    const filteredRoles = useMemo(() => {
        let out = roles;
        if (filterType === 'org') {
            out = out.filter(r => r.list === null);
        } else if (filterType === 'list') {
            out = out.filter(r => r.list !== null);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            out = out.filter(r =>
                r.name.toLowerCase().includes(q) || (r.list?.name || '').toLowerCase().includes(q)
            );
        }
        return out;
    }, [roles, filterType, searchQuery]);

    // Selected role
    const selectedRole = useMemo(() => {
        if (!selectedRoleId) return roles[0] ?? null;
        return roles.find(r => r.id === selectedRoleId) ?? null;
    }, [roles, selectedRoleId]);

    // Create role
    const createRole = useCallback(async (data: RoleFormData): Promise<RoleUI | null> => {
        setActionLoading(true);
        try {
            setError(null);
            const payload: RoleCreate = {
                name: data.name,
                color: data.color,
                level: data.level,
                listId: data.listId,
                permissionsId: data.permissionsId,
            };
            const created = await rolesService.create(payload);
            const normalized = normalizeRole(created as RoleDetail | RoleSummary);
            setRoles(prev => [normalized, ...prev]);
            setSelectedRoleId(normalized.id);
            return normalized;
        } catch (e) {
            console.error('Errore creazione ruolo:', e);
            setError(getErrorMessage(e));
            return null;
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Update role
    const updateRole = useCallback(async (id: string, data: Partial<RoleFormData>): Promise<RoleUI | null> => {
        setActionLoading(true);
        try {
            setError(null);
            const payload: RoleUpdate = {
                id: Number(id),
                name: data.name,
                color: data.color,
                level: data.level,
                permissions: data.permissionsId,
            };
            const updated = await rolesService.update(payload);
            const normalized = normalizeRole(updated as RoleDetail | RoleSummary);
            setRoles(prev => prev.map(r => r.id === id ? normalized : r));
            return normalized;
        } catch (e) {
            console.error('Errore aggiornamento ruolo:', e);
            setError(getErrorMessage(e));
            return null;
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Delete role
    const deleteRole = useCallback(async (id: string): Promise<boolean> => {
        setActionLoading(true);
        try {
            setError(null);
            await rolesService.delete(Number(id));
            setRoles(prev => {
                const next = prev.filter(r => r.id !== id);
                // Update selection if deleted role was selected
                if (selectedRoleId === id) {
                    setSelectedRoleId(next.length > 0 ? next[0].id : null);
                }
                return next;
            });
            return true;
        } catch (e) {
            console.error('Errore eliminazione ruolo:', e);
            setError(getErrorMessage(e));
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [selectedRoleId]);

    return {
        roles,
        filteredRoles,
        selectedRole,
        selectedRoleDetail,
        lists,
        loading,
        actionLoading,
        error,
        selectedRoleId,
        setSelectedRoleId,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        fetchRoles,
        fetchRoleDetail,
        createRole,
        updateRole,
        deleteRole,
    };
}
