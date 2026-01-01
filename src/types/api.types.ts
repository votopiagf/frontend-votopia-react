// Re-export da common.types per compatibilità
import type { SuccessResponse, ErrorResponse } from '@/types/common.types';

// Tipo generico per le risposte API
export type ApiResponse<T> =
    | SuccessResponse<T>
    | ErrorResponse;
