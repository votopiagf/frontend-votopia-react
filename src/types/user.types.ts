// Types per User - uso interno frontend

// Types per User - uso interno frontend
import type {RoleSummary} from '@/types/role.types';
import type {ListSummary} from '@/types/list.types';

export interface UserCreate {
    name: string;
    surname: string;
    email: string;
    password: string;
    rolesId?: number[];
    listsId?: number[];
}

export interface UserUpdate {
    id: number;
    name?: string;
    surname?: string;
    email?: string;
    resetPassword?: boolean;
    addLists?: number[];
    removeLists?: number[];
    rolesId?: number[]; // Per aggiornare i ruoli
}

export interface UserDetail {
    id: number;
    name: string;
    surname: string;
    email: string;
    roles: RoleSummary[];
    deleted: boolean;
    mustChangePassword: boolean;
    lists: ListSummary[];
}

export interface UserSummary {
    id: number;
    name: string;
    surname: string;
    email: string;
    roles: RoleSummary[];
    fullName?: string; // Computed property per il frontend
}

export interface UserState {
    users: UserSummary[];
    selectedUser: UserDetail | null;
    loading: boolean;
    error: string | null;
}

export const displayNameFromDetail = (u: UserDetail): string => {
    const full = `${u.name ?? ''} ${u.surname ?? ''}`.trim();
    return full || u.email;
};

// --- Nuova util: genera iniziali da name + surname ---
export const initialsFromDetail = (u: UserDetail | UserSummary | { name?: string; surname?: string; email?: string }): string => {
    const name = 'name' in u ? u.name ?? '' : '';
    const surname = 'surname' in u ? u.surname ?? '' : '';
    const email = 'email' in u ? u.email ?? '' : '';
    const full = `${name} ${surname}`.trim() || email || '';
    if (!full) return '';
    const parts = full.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
