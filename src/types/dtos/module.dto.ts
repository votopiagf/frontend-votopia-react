// DTOs per Module - come ricevuti dal server

import type { PlanSummaryDto } from '@/types/dtos/plan.dto';

export interface ModuleCreateDto {
    name: string;
    description?: string;
}

export interface ModuleUpdateDto {
    id: number;
    name?: string;
    description?: string;
}

export interface ModuleDetailDto {
    id: number;
    name: string;
    description: string;
    plains: PlanSummaryDto[];
}

export interface ModuleSummaryDto {
    id: number;
    name: string;
    description: string;
}
