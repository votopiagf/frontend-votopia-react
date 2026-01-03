import api from './api';
import type {
    Organization,
    LoginPayload,
    LoginResponse,
} from '@/types/auth.types';
import type {ApiResponse} from '@/types/api.types';

class AuthService {
    // Verifica esistenza organizzazione
    async checkOrganization(
        organization_code: string
    ): Promise<ApiResponse<Organization>> {
        console.log('🏢 Checking organization with code:', organization_code);
        const response = await api.get<ApiResponse<Organization>>(
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
    ): Promise<ApiResponse<LoginResponse>> {
        console.log('🔐 Attempting login for user:', email, 'in organization:', codeOrg);
        const payload: LoginPayload = { email, password, codeOrg };
        const response = await api.post<ApiResponse<LoginResponse>>(
            '/api/auth/login/',
            payload
        );

        // Salva token in localStorage
        if (response.data.success) {
            console.log('✅ Login successful!');
            console.log('💡 Full login response:', response.data);
            console.log('Response data:', response.data.data);

            const data = response.data.data;

            if (data?.token) {
                localStorage.setItem('authToken', data.token);
            }

            if (data?.userSummaryDto) {
                localStorage.setItem('user', JSON.stringify(data.userSummaryDto));
                console.log('✅ User logged in:', data.userSummaryDto.email);
            } else {
                console.warn('⚠️ User summary is missing in response!');
                localStorage.removeItem('user'); // pulizia sicura
            }
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