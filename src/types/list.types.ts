import type {SchoolSummary} from "@/types/school.types";

export interface ListBasic{
    id: bigint;
    name: string;
    description: string;
}

export interface ListCreate{
    name: string;
    description?: string;
    slogan?: string;
    colorPrimary?: string;
    colorSecondary?: string;
    logoFileId: bigint;
}

export interface ListSummary{
    id: bigint;
    name: string;
    school: SchoolSummary;
    description: string;
    slogan: string;
    colorPrimary: string;
    colorSecondary: string;
    logoFileId: string //TODO;
}

export interface ListUpdate{
    id: bigint;
    name?: string;
    description?: string;
    slogan?: string;
    colorPrimary?: string;
    colorSecondary?: string;
    logoFileId?: bigint;
}