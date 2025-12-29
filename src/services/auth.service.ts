import api from './api';
import type {
    Organization,
    OrganizationCheckPayload,
    LoginPayload,
    LoginResponse,
} from '@/types/auth.types';
import type {SuccessResponse} from '@/types/api.types';

class AuthService {
    // Verifica esistenza organizzazione
    async checkOrganization(
        code: string
    ): Promise<SuccessResponse<Organization>> {
        const payload: OrganizationCheckPayload = { code };
        const response = await api.post<SuccessResponse<Organization>>(
            '/api/auth/organization',
            payload
        );
        return response.data;
    }

    // Login con credenziali
    async login(
        email: string,
        password: string,
        organizationCode: string
    ): Promise<SuccessResponse<LoginResponse>> {
        const payload: LoginPayload = { email, password, organizationCode };
        const response = await api.post<SuccessResponse<LoginResponse>>(
            '/api/auth/login',
            payload
        );

        // Salva token in localStorage
        if (response.data.success && response.data.data.token) {
            localStorage.setItem('authToken', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            localStorage.setItem(
                'organization',
                JSON.stringify(response.data.data.organization)
            );
        }

        return response.data;
    }

    // Logout
    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('organization');
    }

    // Verifica se l'utente è autenticato
    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    // Ottieni utente corrente
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Ottieni organizzazione corrente
    getCurrentOrganization() {
        const orgStr = localStorage.getItem('organization');
        return orgStr ? JSON.parse(orgStr) : null;
    }
}

export default new AuthService();
