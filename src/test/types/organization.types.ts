// Types per Organization - uso interno frontend

// Types per Organization - uso interno frontend
import type {PlanSummary} from '@/test/types/plan.types.ts';

export type OrganizationStatus = 'ACTIVE' | 'INACTIVE';

export interface OrganizationCreate {
    name: string;
    planId?: number;
}

export interface OrganizationUpdate {
    id: number;
    name?: string;
    status?: OrganizationStatus;
    resetCode?: boolean;
    planId?: number;
}

export interface OrganizationDetail {
    id: number;
    code: string;
    name: string;
    plan: PlanSummary;
    status: OrganizationStatus;
    maxLists: number;
    createdAt: Date;
}

export interface OrganizationSummary {
    id: number;
    code: string;
    name: string;
    status: OrganizationStatus;
}

export interface OrganizationState {
    organizations: OrganizationSummary[];
    currentOrganization: OrganizationDetail | null;
    loading: boolean;
    error: string | null;
}
