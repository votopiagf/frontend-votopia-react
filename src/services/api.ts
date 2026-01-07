import axios, { AxiosError } from 'axios';
import type {ApiResponse} from '@/types/api.types';
import type {ErrorResponse} from "@/types";

// URL base del backend (usa variabile d'ambiente se disponibile)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
        if (import.meta.env.DEV) {
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

// Interceptor per gestire errori globali e logging delle risposte
api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.group(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
            console.log('Status:', response.status, response.statusText);
            const fullUrl = new URL(response.config.url || '', response.config.baseURL || 'http://localhost').toString();
            console.log('Full URL:', fullUrl);
            console.log('Response Data:', response.data);
            console.log('Timestamp:', new Date().toISOString());
            console.groupEnd();
        }

        return response;
    },
    (error: AxiosError<ApiResponse<ErrorResponse>>) => {
        console.group(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        console.error('Error Status:', error.response?.status);
        console.error('Error Message:', error.response?.data?.message || error.message);
        console.error('Error Data:', error.response?.data);
        console.error('Full Error:', error);
        console.log('Timestamp:', new Date().toISOString());
        console.groupEnd();

        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
