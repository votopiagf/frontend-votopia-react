// Types comuni - uso interno frontend

export interface ErrorResponse {
    success: false;
    status: number;
    message: string;
    timestamp: number;
}

export interface SuccessResponse<T> {
    success: true;
    status: number;
    data: T;
    message: string;
    timestamp: number;
}

export interface ApiError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export type LoadingState = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
