// Types per autenticazione - uso interno frontend

// Types per autenticazione - uso interno frontend
import type {UserSummary} from '@/test/types/user.types.ts';

export interface LoginRequest {
    codeOrg: string;
    email: string;
    password: string;
}

export interface LoginSummary {
    token: string;
    userSummaryDto?: UserSummary;
}

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: UserSummary | null;
    loading: boolean;
    error: string | null;
}

// Aliases per compatibilità con codice esistente
export type LoginPayload = LoginRequest;
export type LoginResponse = LoginSummary;

// Tipo Organization per compatibilità
export interface Organization {
    id: number;
    code: string;
    name: string;
    description?: string;
}

// Tipo User per compatibilità (semplificato)
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    organizationId: number;
}

// Payload per la verifica organizzazione
export interface OrganizationCheckPayload {
    code: string;
}
