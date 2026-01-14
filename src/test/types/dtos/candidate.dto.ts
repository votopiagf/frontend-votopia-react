// DTOs per Candidate - come ricevuti dal server

// DTOs per Candidate - come ricevuti dal server
import type {UserSummaryDto} from '@/test/types/dtos/user.dto.ts';
import type { FileSummaryDto } from '@/test/types/dtos/file.dto.ts';
import type { ListSummaryDto } from '@/test/types/dtos/list.dto.ts';
import type { File } from '@/test/types/file.types.ts';

export interface CandidateCreateDto {
    userId: number;
    schoolClass: string;
    photoFileId?: number;
    bio?: string;
    listId: number;
}

export interface CandidateDetailDto {
    id: number;
    list: ListSummaryDto;
    user: UserSummaryDto;
    schoolClass: string;
    photoFileId: FileSummaryDto;
    bio: string;
    createdAt: string;
}

export interface CandidateSummaryDto {
    id: number;
    user: UserSummaryDto;
    schoolClass: string;
    photoFileId: File;
}
