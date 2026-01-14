// Types per Candidate - uso interno frontend

// Types per Candidate - uso interno frontend
import type {UserSummary} from '@/test/types/user.types.ts';
import type { FileSummary, File } from '@/test/types/file.types.ts';
import type {ListSummary} from '@/test/types/list.types.ts';

export interface CandidateCreate {
    userId: number;
    schoolClass: string;
    photoFileId?: number;
    bio?: string;
    listId: number;
}

export interface CandidateDetail {
    id: number;
    list: ListSummary;
    user: UserSummary;
    schoolClass: string;
    photo: FileSummary;
    bio: string;
    createdAt: Date;
    fullName?: string; // Computed da user
}

export interface CandidateSummary {
    id: number;
    user: UserSummary;
    schoolClass: string;
    photo: File;
    fullName?: string; // Computed
}

export interface CandidateState {
    candidates: CandidateSummary[];
    selectedCandidate: CandidateDetail | null;
    loading: boolean;
    error: string | null;
}
