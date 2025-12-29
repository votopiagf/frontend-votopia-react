import axios, { AxiosError } from 'axios';
import type {ErrorResponse} from '@/types/api.types';

// URL base del backend (usa variabile d'ambiente se disponibile)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Configurazione axios
export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor per aggiungere token alle richieste
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor per gestire errori globali
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
            // Token scaduto o non valido
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
