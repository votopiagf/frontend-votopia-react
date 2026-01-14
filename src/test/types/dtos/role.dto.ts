// DTOs per Role - come ricevuti dal server

import type { ListSummaryDto } from '@/test/types/dtos/list.dto.ts';
import type { PermissionSummaryDto } from '@/test/types/dtos/permission.dto.ts';

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
