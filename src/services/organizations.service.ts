import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
    OrganizationCreateDto,
    OrganizationUpdateDto,
    OrganizationDetailDto,
    OrganizationSummaryDto
} from '@/types/dtos/organization.dto';

class OrganizationService {
    private readonly baseUrl = '/api/organizations';

    // Get all organizations
    async getAll(): Promise<OrganizationSummaryDto[]> {
        const response = await api.get<ApiResponse<OrganizationSummaryDto[]>>(this.baseUrl);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch organizations');
    }

    // Get organization by ID
    async getById(id: number): Promise<OrganizationDetailDto> {
        const response = await api.get<ApiResponse<OrganizationDetailDto>>(`${this.baseUrl}/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch organization');
    }

    // Get organization by code
    async getByCode(code: string): Promise<OrganizationDetailDto> {
        const response = await api.get<ApiResponse<OrganizationDetailDto>>(`${this.baseUrl}/by-code`, {
            params: { organization_code: code }
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch organization by code');
    }

    // Create new organization
    async create(payload: OrganizationCreateDto): Promise<OrganizationDetailDto> {
        const response = await api.post<ApiResponse<OrganizationDetailDto>>(this.baseUrl, payload);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create organization');
    }

    // Update organization
    async update(id: number, payload: Partial<OrganizationUpdateDto>): Promise<OrganizationDetailDto> {
        const response = await api.put<ApiResponse<OrganizationDetailDto>>(`${this.baseUrl}/${id}`, {
            ...payload,
            id
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update organization');
    }

    // Delete organization
    async delete(id: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete organization');
        }
    }

    // Reset organization code
    async resetCode(id: number): Promise<OrganizationDetailDto> {
        const response = await api.post<ApiResponse<OrganizationDetailDto>>(`${this.baseUrl}/${id}/reset-code`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to reset organization code');
    }

    // Change organization status
    async changeStatus(id: number, status: 'ACTIVE' | 'INACTIVE'): Promise<OrganizationDetailDto> {
        const response = await api.put<ApiResponse<OrganizationDetailDto>>(`${this.baseUrl}/${id}`, {
            id,
            status
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to change organization status');
    }

    // Change organization plan
    async changePlan(id: number, planId: number): Promise<OrganizationDetailDto> {
        const response = await api.put<ApiResponse<OrganizationDetailDto>>(`${this.baseUrl}/${id}`, {
            id,
            planId
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to change organization plan');
    }
}

export const organizationService = new OrganizationService();
export default organizationService;
