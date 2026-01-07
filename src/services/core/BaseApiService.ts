/**
 * Core Service - API Client Base
 * Gestisce tutte le comunicazioni con il backend
 * Pattern: Repository + Factory Method
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ApiErrorResponse {
    success: false;
    status: number;
    message: string;
    errors?: Record<string, string[]>;
    timestamp: number;
}

export interface ApiSuccessResponse<T> {
    success: true;
    status: number;
    data: T;
    message: string;
    timestamp: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiServiceError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'ApiServiceError';
    }
}

/**
 * Abstract Base Service per tutti i servizi API
 */
export abstract class BaseApiService {
    protected readonly client: AxiosInstance;

    constructor(baseURL: string = import.meta.env.VITE_API_URL) {
        this.client = axios.create({
            baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor per errori
        this.client.interceptors.response.use(
            response => response,
            this.handleError.bind(this)
        );
    }

    /**
     * Estrae i dati dalla risposta API
     */
    protected extractData<T>(response: ApiResponse<T>): T {
        if (!response.success) {
            throw new ApiServiceError(
                response.status,
                response.message,
                { errors: (response as ApiErrorResponse).errors }
            );
        }
        return response.data;
    }

    /**
     * Gestisce gli errori API in modo centralizzato
     */
    private handleError(error: AxiosError<ApiErrorResponse>): Promise<never> {
        const status = error.response?.status ?? 500;
        const message = error.response?.data?.message ?? error.message;
        const details = error.response?.data?.errors;

        throw new ApiServiceError(status, message, details);
    }
}

