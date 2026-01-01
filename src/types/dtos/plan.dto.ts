// DTOs per Plan - come ricevuti dal server

import type { ModuleDetailDto } from '@/types/dtos/module.dto';

export interface PlanCreateDto {
    id: number;
    name: string;
    price: number;
    modulesId?: number[];
}

export interface PlanUpdateDto {
    id: number;
    name?: string;
    price?: number;
    addModules?: number[];
    removeModules?: number[];
}

export interface PlanDetailDto {
    id: number;
    name: string;
    price: number;
    createdAt: string;
    modules: ModuleDetailDto[];
}

export interface PlanSummaryDto {
    id: number;
    name: string;
    price: number;
}
