import api from './api';
import type {
    Organization,
    LoginPayload,
    LoginResponse,
} from '@/types/auth.types';

class AuthService {
    // Verifica esistenza organizzazione
    async checkOrganization(
        organization_code: string
    ): Promise<Organization> {
        console.log('🏢 Checking organization with code:', organization_code);
        const data = await api.get<Organization>('/api/organizations/by-code/', {
            params: {organization_code}
        });
        console.log('✅ Organization check result:', data ? 'Found' : 'Not found');
        return data as unknown as Organization;
    }

    // Login con credenziali
    async login(
        email: string,
        password: string,
        codeOrg: string
    ): Promise<LoginResponse> {
        console.log('🔐 Attempting login for user:', email, 'in organization:', codeOrg);
        const payload: LoginPayload = { email, password, codeOrg };
        const data = await api.post<LoginResponse>('/api/auth/login/', payload);

        // Salva token in localStorage
        const loginData = data as unknown as LoginResponse;

        if (loginData?.token) {
            console.log('✅ Login successful!');
            localStorage.setItem('authToken', loginData.token);
        }

        if (loginData?.userSummaryDto) {
            localStorage.setItem('user', JSON.stringify(loginData.userSummaryDto));
            console.log('✅ User logged in:', loginData.userSummaryDto.email);
        } else {
            console.warn('⚠️ User summary is missing in login response!');
            localStorage.removeItem('user'); // pulizia sicura
        }

        return loginData;
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