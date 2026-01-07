/**
 * useUsers Hook - Enterprise Architecture
 * Pattern: Custom Hook + Dependency Injection
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { resolve } from '@/infrastructure/di/Container';
import type { UserUseCases } from '@/application/usecases/UserUseCases';
import type { User, Role, List } from '@/domain/mappers/UserMapper';
import { ApiServiceError } from '@/services/core/BaseApiService';
import type { CreateUserRequest, UpdateUserRequest } from '@/data/repositories/UserRepository';

/**
 * Presentation Model - Dati per la UI
 */
export interface UserViewModel {
    user: User;
    displayName: string;
    initials: string;
    roleNames: string[];
    listNames: string[];
}

interface UseUsersState {
    users: UserViewModel[];
    filteredUsers: UserViewModel[];
    roles: Role[];
    lists: List[];
    selectedUser: UserViewModel | null;
    loading: boolean;
    actionLoading: boolean;
    error: string | null;
}

interface UseUsersActions {
    selectedUserId: string | null;
    setSelectedUserId: (id: string | null) => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    selectedRoleId: number | null;
    setSelectedRoleId: (id: number | null) => void;
    selectedListId: number | null;
    setSelectedListId: (id: number | null) => void;
}

interface UseUsersOperations {
    fetchUsers: () => Promise<void>;
    createUser: (request: CreateUserRequest) => Promise<User | null>;
    updateUser: (id: number, request: UpdateUserRequest) => Promise<User | null>;
    deleteUser: (id: number) => Promise<boolean>;
    deleteUsers: (ids: number[]) => Promise<boolean>;
    exportAsExcel: (listId?: number) => Promise<void>;
}

export type UseUsersReturn = UseUsersState & UseUsersActions & UseUsersOperations;

/**
 * Converter: Domain Model -> View Model
 */
function toViewModel(user: User): UserViewModel {
    return {
        user,
        displayName: user.fullName,
        initials: user.initials,
        roleNames: user.roles.map(r => r.name),
        listNames: user.lists.map(l => l.name),
    };
}

/**
 * Custom Hook
 */
export function useUsers(): UseUsersReturn {
    const useCases = resolve<UserUseCases>('UserUseCases');

    // State
    const [state, setState] = useState<UseUsersState>({
        users: [],
        filteredUsers: [],
        roles: [],
        lists: [],
        selectedUser: null,
        loading: true,
        actionLoading: false,
        error: null,
    });

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);

    // Errore handler
    const handleError = (error: unknown, context: string): void => {
        const message = error instanceof ApiServiceError
            ? error.message
            : error instanceof Error
                ? error.message
                : 'Errore sconosciuto';

        console.error(`[${context}]:`, message);
        setState(prev => ({ ...prev, error: message }));
    };

    // Queries
    const fetchUsers = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const result = await useCases.getUsers.execute(selectedListId ?? undefined);
            if (!result.isSuccess) throw result.error;

            const users = result.value!.map(toViewModel);
            setState(prev => ({
                ...prev,
                users,
                loading: false,
            }));
        } catch (error) {
            handleError(error, 'fetchUsers');
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [useCases, selectedListId]);

    // Commands
    const createUser = useCallback(async (request: CreateUserRequest): Promise<User | null> => {
        setState(prev => ({ ...prev, actionLoading: true, error: null }));
        try {
            const result = await useCases.createUser.execute(request);
            if (!result.isSuccess) throw result.error;

            const newUser = result.value!;
            setState(prev => ({
                ...prev,
                users: [toViewModel(newUser), ...prev.users],
                actionLoading: false,
            }));
            return newUser;
        } catch (error) {
            handleError(error, 'createUser');
            setState(prev => ({ ...prev, actionLoading: false }));
            return null;
        }
    }, [useCases]);

    const updateUser = useCallback(async (
        id: number,
        request: UpdateUserRequest
    ): Promise<User | null> => {
        setState(prev => ({ ...prev, actionLoading: true, error: null }));
        try {
            const result = await useCases.updateUser.execute({ ...request, id });
            if (!result.isSuccess) throw result.error;

            const updatedUser = result.value!;
            setState(prev => ({
                ...prev,
                users: prev.users.map(u => u.user.id === id ? toViewModel(updatedUser) : u),
                actionLoading: false,
            }));
            return updatedUser;
        } catch (error) {
            handleError(error, 'updateUser');
            setState(prev => ({ ...prev, actionLoading: false }));
            return null;
        }
    }, [useCases]);

    const deleteUser = useCallback(async (id: number): Promise<boolean> => {
        setState(prev => ({ ...prev, actionLoading: true, error: null }));
        try {
            const result = await useCases.deleteUser.execute(id);
            if (!result.isSuccess) throw result.error;

            setState(prev => ({
                ...prev,
                users: prev.users.filter(u => u.user.id !== id),
                actionLoading: false,
            }));
            return true;
        } catch (error) {
            handleError(error, 'deleteUser');
            setState(prev => ({ ...prev, actionLoading: false }));
            return false;
        }
    }, [useCases]);

    const deleteUsers = useCallback(async (ids: number[]): Promise<boolean> => {
        setState(prev => ({ ...prev, actionLoading: true, error: null }));
        try {
            const result = await useCases.deleteMultipleUsers.execute(ids);
            if (!result.isSuccess) throw result.error;

            setState(prev => ({
                ...prev,
                users: prev.users.filter(u => !ids.includes(u.user.id)),
                actionLoading: false,
            }));
            return true;
        } catch (error) {
            handleError(error, 'deleteUsers');
            setState(prev => ({ ...prev, actionLoading: false }));
            return false;
        }
    }, [useCases]);

    const exportAsExcel = useCallback(async (listId?: number): Promise<void> => {
        setState(prev => ({ ...prev, actionLoading: true, error: null }));
        try {
            const result = await useCases.exportUsers.execute(listId);
            if (!result.isSuccess) throw result.error;

            const blob = result.value!;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users-${new Date().toISOString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setState(prev => ({ ...prev, actionLoading: false }));
        } catch (error) {
            handleError(error, 'exportAsExcel');
            setState(prev => ({ ...prev, actionLoading: false }));
        }
    }, [useCases]);

    // Computed
    const filteredUsers = useMemo(() => {
        let result = state.users;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(u =>
                u.displayName.toLowerCase().includes(q) ||
                u.user.email.toLowerCase().includes(q)
            );
        }

        if (selectedRoleId) {
            result = result.filter(u =>
                u.user.roles.some(r => r.id === selectedRoleId)
            );
        }

        if (selectedListId) {
            result = result.filter(u =>
                u.user.lists.some(l => l.id === selectedListId)
            );
        }

        return result;
    }, [state.users, searchQuery, selectedRoleId, selectedListId]);

    const selectedUser = useMemo(() => {
        if (!selectedUserId) return filteredUsers[0] ?? null;
        return filteredUsers.find(u => String(u.user.id) === selectedUserId) ?? null;
    }, [filteredUsers, selectedUserId]);

    // Effects
    useEffect(() => {
        fetchUsers();
    }, [selectedListId]);

    return {
        // State
        ...state,
        filteredUsers,
        selectedUser,

        // Actions
        selectedUserId,
        setSelectedUserId,
        searchQuery,
        setSearchQuery,
        selectedRoleId,
        setSelectedRoleId,
        selectedListId,
        setSelectedListId,

        // Operations
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        deleteUsers,
        exportAsExcel,
    };
}

