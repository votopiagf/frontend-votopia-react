// DTOs per List - come ricevuti dal server

import type { FileSummaryDto } from '@/test/types/dtos/file.dto.ts';
import type { SchoolSummaryDto } from '@/test/types/dtos/school.dto.ts';

export interface ListCreateDto {
    name: string;
    description?: string;
    slogan?: string;
    colorPrimary?: string;
    colorSecondary?: string;
    logoFileId?: number;
}

export interface ListUpdateDto {
    listId: number;
    name?: string;
    description?: string;
    slogan?: string;
    colorPrimary?: string;
    colorSecondary?: string;
    logoFileId?: number;
}

export interface ListDetailDto {
    id: number;
    name: string;
    description: string;
    school: SchoolSummaryDto;
    slogan: string;
    colorPrimary: string;
    colorSecondary: string;
    file: FileSummaryDto;
    createdAt: string;
}

export interface ListSummaryDto {
    id: number;
    name: string;
    school: SchoolSummaryDto | null;
    slogan: string;
    logoFile: FileSummaryDto | null;
}
