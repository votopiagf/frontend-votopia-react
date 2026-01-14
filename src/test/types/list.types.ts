// Types per List - uso interno frontend

// Types per List - uso interno frontend
import type {FileSummary} from '@/test/types/file.types.ts';
import type { SchoolSummary } from '@/test/types/school.types.ts';

export interface ListCreate {
    name: string;
    description?: string;
    slogan?: string;
    colorPrimary?: string;
    colorSecondary?: string;
    logoFileId?: number;
}

export interface ListUpdate {
    listId: number;
    name?: string;
    description?: string;
    slogan?: string;
    colorPrimary?: string;
    colorSecondary?: string;
    logoFileId?: number;
}

export interface ListDetail {
    id: number;
    name: string;
    description: string;
    school: SchoolSummary;
    slogan: string;
    colorPrimary: string;
    colorSecondary: string;
    file: FileSummary;
    createdAt: Date;
}

export interface ListSummary {
    id: number;
    name: string;
    school: SchoolSummary | null;
    slogan: string;
    logoFile: FileSummary | null;
}

export interface ListState {
    lists: ListSummary[];
    selectedList: ListDetail | null;
    loading: boolean;
    error: string | null;
}
