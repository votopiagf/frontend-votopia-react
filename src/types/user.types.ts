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
