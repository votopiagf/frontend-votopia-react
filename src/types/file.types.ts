// Types per File - uso interno frontend

// Types per File - uso interno frontend
import type {ListSummary} from '@/types/list.types';
import type {UserSummary} from '@/types/user.types';

export interface FileCategory {
    id: number;
    name: string;
    createdAt: Date;
}

export interface File {
    id: number;
    name: string;
    list: ListSummary;
    user: UserSummary;
    fileCategory: FileCategory;
    filePath: string;
    mimeType: string;
    uploadedAt: Date;
    url?: string; // URL completo costruito dal frontend
}

export interface FileSummary {
    id: number;
    name: string;
    filePath: string;
    mimeType: string;
    url?: string; // URL completo costruito dal frontend
}

export interface FileDetail {
    id: number;
    name: string;
    list: ListSummary;
    user: UserSummary;
    fileCategory: FileCategory;
    filePath: string;
    mimeType: string;
    uploadedAt: Date;
    url?: string;
    size?: number;
}

export interface FileUploadProgress {
    fileId?: number;
    fileName: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

export interface FileState {
    files: FileSummary[];
    selectedFile: FileDetail | null;
    uploadProgress: FileUploadProgress[];
    loading: boolean;
    error: string | null;
}
