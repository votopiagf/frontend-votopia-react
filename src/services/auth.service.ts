import type {OrganizationBasicInfo} from "@/types/organization.types.ts";
import api from "@/services/api.ts";
import {LoginPayload, LoginResponse} from "@/test/types";

class AuthService {
    async checkOrganization(
        organization_code: string
    ): Promise<OrganizationBasicInfo> {
        const data = await api.get<OrganizationBasicInfo>('/api/organizations/by-code/', {
            params: {organization_code}
        });
        return data as unknown as OrganizationBasicInfo;
    }

    async login(
        email: string,
        password: string,
        codeOrg: string
    ): Promise<LoginResponse>
    {
        const payload: LoginPayload = {email, password, codeOrg};
        const data = await api.post<LoginResponse>('/api/auth/login/', payload);

        const loginData = data as unknown as LoginResponse;

        if (loginData?.token) {
            localStorage.setItem('token', loginData.token);
        }

        if (loginData?.userSummaryDto) {
            localStorage.setItem('user', JSON.stringify(loginData.userSummaryDto));
        } else {
            localStorage.removeItem('user')
            localStorage.removeItem('token');
        }

        return loginData;
    }

    isAuthenticated(): boolean {
        const isAuth = !!localStorage.getItem('token');
        console.log('🔍 Authentication check:', isAuth ? 'Authenticated' : 'Not authenticated');
        return isAuth;
    }
}

export default new AuthService();