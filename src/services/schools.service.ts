import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
    SchoolCreateDto,
    SchoolUpdateDto,
    SchoolDetailDto,
    SchoolSummaryDto
} from '@/types/dtos/school.dto';

class SchoolService {
    private readonly baseUrl = '/api/schools';

    // Get all schools
    async getAll(): Promise<SchoolSummaryDto[]> {
        const response = await api.get<ApiResponse<SchoolSummaryDto[]>>(this.baseUrl);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch schools');
    }

    // Get school by ID
    async getById(id: number): Promise<SchoolDetailDto> {
        const response = await api.get<ApiResponse<SchoolDetailDto>>(`${this.baseUrl}/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch school');
    }

    // Get school by code
    async getByCode(code: string): Promise<SchoolDetailDto> {
        const response = await api.get<ApiResponse<SchoolDetailDto>>(`${this.baseUrl}/by-code`, {
            params: { schoolCode: code }
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch school by code');
    }

    // Search schools by name
    async searchByName(name: string): Promise<SchoolSummaryDto[]> {
        const response = await api.get<ApiResponse<SchoolSummaryDto[]>>(`${this.baseUrl}/search`, {
            params: { name }
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to search schools');
    }

    // Get schools by city
    async getByCity(city: string): Promise<SchoolSummaryDto[]> {
        const response = await api.get<ApiResponse<SchoolSummaryDto[]>>(`${this.baseUrl}/city/${city}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch schools by city');
    }

    // Create new school
    async create(payload: SchoolCreateDto): Promise<SchoolDetailDto> {
        const response = await api.post<ApiResponse<SchoolDetailDto>>(this.baseUrl, payload);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create school');
    }

    // Update school
    async update(id: number, payload: Partial<SchoolUpdateDto>): Promise<SchoolDetailDto> {
        const response = await api.put<ApiResponse<SchoolDetailDto>>(`${this.baseUrl}/${id}`, {
            ...payload,
            id
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update school');
    }

    // Delete school
    async delete(id: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete school');
        }
    }
}

export const schoolService = new SchoolService();
export default schoolService;
