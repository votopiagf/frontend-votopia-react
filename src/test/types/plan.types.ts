// Types per Plan - uso interno frontend

// Types per Plan - uso interno frontend
import type {ModuleDetail } from '@/test/types/module.types.ts';

export interface PlanCreate {
    id: number;
    name: string;
    price: number;
    modulesId?: number[];
}

export interface PlanUpdate {
    id: number;
    name?: string;
    price?: number;
    addModules?: number[];
    removeModules?: number[];
}

export interface PlanDetail {
    id: number;
    name: string;
    price: number;
    createdAt: Date;
    modules: ModuleDetail[];
}

export interface PlanSummary {
    id: number;
    name: string;
    price: number;
    formattedPrice?: string; // Per visualizzazione con valuta
}

export interface PlanState {
    plans: PlanSummary[];
    selectedPlan: PlanDetail | null;
    loading: boolean;
    error: string | null;
}
