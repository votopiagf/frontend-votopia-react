// Types per Module - uso interno frontend

import type { PlanSummary } from '@/test/types/plan.types.ts';

export interface ModuleCreate {
    name: string;
    description?: string;
}

export interface ModuleUpdate {
    id: number;
    name?: string;
    description?: string;
}

export interface ModuleDetail {
    id: number;
    name: string;
    description: string;
    plans: PlanSummary[];
}

export interface ModuleSummary {
    id: number;
    name: string;
    description: string;
}

export interface ModuleState {
    modules: ModuleSummary[];
    selectedModule: ModuleDetail | null;
    loading: boolean;
    error: string | null;
}
