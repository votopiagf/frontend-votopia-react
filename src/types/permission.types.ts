// Types per Permission - uso interno frontend

// Types per Permission - uso interno frontend
import type {RoleSummary} from '@/types/role.types';

export interface PermissionCreate {
    name: string;
    description?: string;
}

export interface PermissionUpdate {
    id: number;
    name?: string;
    description?: string;
}

export interface PermissionDetail {
    id: number;
    name: string;
    description?: string;
    roles: RoleSummary[];
}

export interface PermissionSummary {
    id: number;
    name: string;
}

export interface PermissionState {
    permissions: PermissionSummary[];
    selectedPermission: PermissionDetail | null;
    loading: boolean;
    error: string | null;
}
