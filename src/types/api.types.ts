// Risposta di successo dal backend
export interface SuccessResponse<T> {
    success: boolean;
    status: number;
    data: T;
    message: string;
    timestamp: number;
}

// Risposta di errore dal backend
export interface ErrorResponse {
    success: boolean;
    status: number;
    message: string;
    timestamp: number;
}

// Tipo generico per le risposte API
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
