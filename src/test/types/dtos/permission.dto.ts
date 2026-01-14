// DTOs per Permission - come ricevuti dal server

import type { RoleSummaryDto } from '@/test/types/dtos/role.dto.ts';

export interface PermissionCreateDto {
    name: string;
    description?: string;
}

export interface PermissionUpdateDto {
    id: number;
    name?: string;
    description?: string;
}

export interface PermissionDetailDto {
    id: number;
    name: string;
    description?: string;
    roles: RoleSummaryDto[];
}

export interface PermissionSummaryDto {
    id: number;
    name: string;
}
