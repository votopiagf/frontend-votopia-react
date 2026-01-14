// Re-export da common.types per compatibilità
import type { SuccessResponse, ErrorResponse } from '@/test/types/common.types.ts';

// Tipo generico per le risposte API
export type ApiResponse<T> =
    | SuccessResponse<T>
    | ErrorResponse;
