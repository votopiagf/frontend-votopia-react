import axios, { AxiosError, AxiosResponse } from 'axios';
import type { ApiError as FrontendApiError } from '@/test/types/common.types.ts';
import { isDev } from '@/test/lib/env.ts';

const BASE_URL = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } })?.env?.VITE_API_BASE_URL || '';

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/* --- REQUEST INTERCEPTOR --- */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (isDev()) {
            console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* --- HELPER PER IL TYPE GUARD --- */
function isSuccessResponse<T>(obj: unknown): obj is { success: true; data: T } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        (obj as any).success === true &&
        'data' in obj
    );
}

/* --- RESPONSE INTERCEPTOR --- */
api.interceptors.response.use(
    (response: AxiosResponse) => {
        if (isDev()) {
            console.log(`✅ [API Response] ${response.config.url}`, response.data);
        }

        if (response.config.responseType === 'blob' || response.data instanceof Blob) {
            return response;
        }

        const body = response.data;

        // Se il backend usa il wrapper { success: true, data: ... }
        if (body && typeof body === 'object' && 'success' in body) {
            if (isSuccessResponse(body)) {
                return body.data;
            }
            // Se success è false, lo trattiamo come errore
            return Promise.reject({
                message: body.message || 'Errore operazione',
                status: body.status || response.status,
                errors: body.errors
            } as FrontendApiError);
        }

        return body;
    },
    (error: AxiosError) => {
        // --- LOGICA DI NORMALIZZAZIONE ERRORE ---
        let apiError: FrontendApiError = {
            message: 'Si è verificato un errore imprevisto.',
            status: error.response?.status || 500
        };

        if (error.response?.data) {
            const data = error.response.data as any;

            // Mappiamo esattamente l'oggetto che hai ricevuto dal backend
            apiError = {
                message: data.message || error.message,
                status: data.status || error.response.status,
                errors: data.errors // Passiamo l'oggetto errors (se presente)
            };
        } else if (error.request) {
            // Caso in cui non c'è risposta (es. server down)
            apiError.message = 'Il server non risponde. Controlla la tua connessione.';
        }

        // Logging dell'errore in sviluppo
        if (isDev()) {
            console.error(`❌ [API Error] ${error.config?.url}`, apiError);
        }

        // Gestione automatica logout su 401
        if (apiError.status === 401) {
            localStorage.removeItem('authToken');
            // Evitiamo redirect infiniti se siamo già in login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(apiError);
    }
);

export default api;