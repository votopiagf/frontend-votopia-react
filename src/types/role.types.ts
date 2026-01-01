// Types per Role - uso interno frontend

// Types per Role - uso interno frontend
import type {ListSummary} from '@/types/list.types';
import type {PermissionSummary} from '@/types/permission.types';

export interface RoleCreate {
    name: string;
    orgId?: number;
    listId?: number;
    permissionsId?: number[];
    color?: string;
    level: number;
}

export interface RoleUpdate {
    id: number;
    name?: string;
    color?: string;
    level?: number;
    permissions?: number[];
}

export interface RoleDetail {
    id: number;
    list: ListSummary;
    name: string;
    color: string;
    level: number;
    permissions: PermissionSummary[];
    createdAt: Date;
}

export interface RoleSummary {
    id: number;
    list: ListSummary;
    name: string;
    color: string;
}

export interface RoleInfoResponse {
    roles: RoleSummary[];
    userRoles: RoleSummary[];
    count: number;
}

export interface RoleState {
    roles: RoleSummary[];
    selectedRole: RoleDetail | null;
    loading: boolean;
    error: string | null;
}
