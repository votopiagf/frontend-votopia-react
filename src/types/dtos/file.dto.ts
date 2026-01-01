// DTOs per File - come ricevuti dal server

import type { ListSummaryDto } from '@/types/dtos/list.dto';
import type { UserSummaryDto } from '@/types/dtos/user.dto';

export interface FileCategory {
    id: number;
    name: string;
    createdAt: string;
}

export interface FileDetailDto {
    id: number;
    name: string;
    list: ListSummaryDto;
    user: UserSummaryDto;
    fileCategory: FileCategory;
    filePath: string;
    mimeType: string;
    uploadedAt: string;
}

export interface FileSummaryDto {
    id: number;
    name: string;
    filePath: string;
    mimeType: string;
}
