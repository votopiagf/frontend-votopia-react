import axios, { AxiosError, AxiosResponse } from 'axios';
import type {ErrorResponse, ApiError as FrontendApiError} from '@/types/common.types';
import { isDev } from '@/lib/env';

// URL base del backend (usa variabile d'ambiente se disponibile)
const BASE_URL = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } })?.env?.VITE_API_BASE_URL || '';

export const api = axios.create({
    baseURL: BASE_URL, // vuoto = usa proxy
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor per aggiungere token alle richieste e logging
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log della richiesta (solo in dev)
        if (isDev()) {
            console.group(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
            console.log('Full URL:', `${config.baseURL}${config.url}`);
            console.log('Headers:', config.headers);
            if (config.data) {
                console.log('Request Data:', config.data);
            }
            console.log('Query Params:', config.params && Object.keys(config.params).length > 0 ? config.params : '<none>');
            console.log('Timestamp:', new Date().toISOString());
            console.groupEnd();
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Type guard per ApiResponse success
function isSuccessResponse<T>(obj: unknown): obj is { success: true; data: T } {
    if (!obj || typeof obj !== 'object') return false;
    const rec = obj as Record<string, unknown>;
    return rec['success'] === true && 'data' in rec;
}

// Interceptor per gestire errori globali e logging delle risposte
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Logging (dev)
        if (isDev()) {
            console.group(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
            console.log('Status:', response.status, response.statusText);
            const fullUrl = new URL(response.config.url || '', response.config.baseURL || 'http://localhost').toString();
            console.log('Full URL:', fullUrl);
            console.log('Response Data:', response.data);
            console.log('Timestamp:', new Date().toISOString());
            console.groupEnd();
        }

        // If the response is a binary blob (file download), return it as-is
        if (response.config.responseType === 'blob' || response.data instanceof Blob) {
            return response;
        }

        const body = response.data;

        // If backend uses SuccessResponse / ErrorResponse wrapper
        if (body && typeof body === 'object' && 'success' in (body as Record<string, unknown>)) {
            // Success wrapper
            if (isSuccessResponse(body)) {
                // Return the inner data so callers don't need to unwrap
                return body.data;
            }

            // Error wrapper: transform to a frontend-friendly error and reject
            const errBody = body as ErrorResponse;
            const apiError: FrontendApiError = {
                message: errBody.message || 'Errore dal server',
                status: errBody.status,
            };

            return Promise.reject(apiError);
        }

        // Not wrapped: return raw body
        return body;
    },
    (error: AxiosError) => {
        // Build a normalized ApiError for the frontend
        let apiError: FrontendApiError = { message: error.message };

        if (error.response && error.response.data && typeof error.response.data === 'object') {
            const data = error.response.data as unknown as Record<string, unknown>;
            // If backend returned our ErrorResponse wrapper
            if (data && ("message" in data || "status" in data)) {
                apiError = {
                    message: typeof data.message === 'string' ? data.message as string : apiError.message,
                    status: typeof data.status === 'number' ? data.status as number : error.response.status,
                    errors: (data.errors as Record<string, string[]>) ?? undefined,
                };
            } else {
                // Some other shape - try to extract message/status
                apiError = {
                    message: (typeof data.message === 'string' && data.message) ? data.message as string : JSON.stringify(data) || apiError.message,
                    status: error.response.status,
                };
            }
        } else if (!error.response) {
            // Network error (no response)
            apiError = { message: 'Network Error' };
        } else {
            apiError = { message: error.message, status: error.response.status };
        }

        console.group(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        console.error('Error Status:', error.response?.status);
        console.error('Error Message:', apiError.message || error.message);
        console.error('Error Data:', error.response?.data || error);
        console.error('Full Error:', error);
        console.log('Timestamp:', new Date().toISOString());
        console.groupEnd();

        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }

        return Promise.reject(apiError);
    }
);

export default api;
