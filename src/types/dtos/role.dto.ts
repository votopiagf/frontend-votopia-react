// DTOs per Role - come ricevuti dal server

import type { ListSummaryDto } from '@/types/dtos/list.dto';
import type { PermissionSummaryDto } from '@/types/dtos/permission.dto';

export interface RoleCreateDto {
    name: string;
    orgId?: number;
    listId?: number;
    permissionsId?: number[];
    color?: string;
    level: number;
}

export interface RoleUpdateDto {
    id: number;
    name?: string;
    color?: string;
    level?: number;
    permissions?: number[];
}

export interface RoleDetailDto {
    id: number;
    list: ListSummaryDto;
    name: string;
    color: string;
    level: number;
    permissions: PermissionSummaryDto[];
    createdAt: string;
}

export interface RoleSummaryDto {
    id: number;
    list: ListSummaryDto;
    name: string;
    color: string;
}

export interface RoleInfoResponse {
    roles: RoleSummaryDto[];
    userRoles: RoleSummaryDto[];
    count: number;
}
