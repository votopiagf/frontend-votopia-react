// DTOs per Organization - come ricevuti dal server

import type { PlanSummaryDto } from '@/test/types/dtos/plan.dto.ts';

export type OrganizationStatus = 'ACTIVE' | 'INACTIVE';

export interface OrganizationCreateDto {
    name: string;
    planId?: number;
}

export interface OrganizationUpdateDto {
    id: number;
    name?: string;
    status?: OrganizationStatus;
    resetCode?: boolean;
    planId?: number;
}

export interface OrganizationDetailDto {
    id: number;
    code: string;
    name: string;
    plan: PlanSummaryDto;
    status: OrganizationStatus;
    maxLists: number;
    createdAt: string;
}

export interface OrganizationSummaryDto {
    id: number;
    code: string;
    name: string;
    status: OrganizationStatus;
}
