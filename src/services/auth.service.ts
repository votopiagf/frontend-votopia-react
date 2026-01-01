import api from './api';
import type {
    Organization,
    LoginPayload,
    LoginResponse,
} from '@/types/auth.types';
import type {SuccessResponse} from '@/types/api.types';

class AuthService {
    // Verifica esistenza organizzazione
    async checkOrganization(
        organization_code: string
    ): Promise<SuccessResponse<Organization>> {
        console.log('🏢 Checking organization with code:', organization_code);
        const response = await api.get<SuccessResponse<Organization>>(
            '/api/organizations/by-code/',
            {
                params: {organization_code}
            }
        );
        console.log('✅ Organization check result:', response.data.success ? 'Found' : 'Not found');
        return response.data;
    }

    // Login con credenziali
    async login(
        email: string,
        password: string,
        codeOrg: string
    ): Promise<SuccessResponse<LoginResponse>> {
        console.log('🔐 Attempting login for user:', email, 'in organization:', codeOrg);
        const payload: LoginPayload = { email, password, codeOrg };
        const response = await api.post<SuccessResponse<LoginResponse>>(
            '/api/auth/login/',
            payload
        );

        // Salva token in localStorage
        if (response.data.success && response.data.data.token) {
            console.log('✅ Login successful, saving auth data...');
            localStorage.setItem('authToken', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.userSummaryDto));
            console.log('✅ User logged in:', response.data.data.userSummaryDto.email);
        } else {
            console.error('❌ Login failed:', response.data.message);
        }

        return response.data;
    }

    // Logout
    logout(): void {
        console.log('🚪 Logging out user...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('organization');
        console.log('✅ User logged out successfully');
    }

    // Verifica se l'utente è autenticato
    isAuthenticated(): boolean {
        const isAuth = !!localStorage.getItem('authToken');
        console.log('🔍 Authentication check:', isAuth ? 'Authenticated' : 'Not authenticated');
        return isAuth;
    }

    // Ottieni utente corrente
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user) {
            console.log('👤 Current user:', user.email);
        }
        return user;
    }

    // Ottieni organizzazione corrente
    getCurrentOrganization() {
        const orgStr = localStorage.getItem('organization');
        const org = orgStr ? JSON.parse(orgStr) : null;
        if (org) {
            console.log('🏢 Current organization:', org.name);
        }
        return org;
    }
}

export default new AuthService();
