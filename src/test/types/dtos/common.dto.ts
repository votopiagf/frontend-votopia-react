// DTOs comuni - come ricevuti dal server

export interface ErrorResponse {
    success: boolean;
    status: number;
    message: string;
    timestamp: number;
}

export interface SuccessResponse<T> {
    success: boolean;
    status: number;
    data: T;
    message: string;
    timestamp: number;
}
