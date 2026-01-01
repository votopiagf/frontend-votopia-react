// Tipo per l'organizzazione
export interface Organization {
    id: string;
    code: string;
    name: string;
    description?: string;
}

// Tipo per l'utente
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    organizationId: string;
}

// Payload per la verifica organizzazione
export interface OrganizationCheckPayload {
    code: string;
}

// Payload per il login
export interface LoginPayload {
    email: string;
    password: string;
    codeOrg: string;
}

// Risposta del login
export interface LoginResponse {
    token: string;
    userSummaryDto: User;
}
