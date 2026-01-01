// DTOs per Candidate - come ricevuti dal server

// DTOs per Candidate - come ricevuti dal server
import type {UserSummaryDto} from '@/types/dtos/user.dto';
import type { FileSummaryDto } from '@/types/dtos/file.dto';
import type { ListSummaryDto } from '@/types/dtos/list.dto';
import type { File } from '@/types/file.types';

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
