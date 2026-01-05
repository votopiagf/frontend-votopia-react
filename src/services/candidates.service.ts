import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
    CandidateCreateDto,
    CandidateDetailDto,
    CandidateSummaryDto
} from '@/types/dtos/candidate.dto';

class CandidateService {
    private readonly baseUrl = '/api/candidates';

    // Get all candidates
    async getAll(): Promise<CandidateSummaryDto[]> {
        const response = await api.get<ApiResponse<CandidateSummaryDto[]>>(this.baseUrl);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch candidates');
    }

    // Get candidate by ID
    async getById(id: number): Promise<CandidateDetailDto> {
        const response = await api.get<ApiResponse<CandidateDetailDto>>(`${this.baseUrl}/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch candidate');
    }

    // Get candidates by list ID
    async getByListId(listId: number): Promise<CandidateSummaryDto[]> {
        const response = await api.get<ApiResponse<CandidateSummaryDto[]>>(`${this.baseUrl}/list/${listId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch candidates by list');
    }

    // Get candidates by user ID
    async getByUserId(userId: number): Promise<CandidateSummaryDto[]> {
        const response = await api.get<ApiResponse<CandidateSummaryDto[]>>(`${this.baseUrl}/user/${userId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch candidates by user');
    }

    // Create new candidate
    async create(payload: CandidateCreateDto): Promise<CandidateDetailDto> {
        const response = await api.post<ApiResponse<CandidateDetailDto>>(this.baseUrl, payload);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create candidate');
    }

    // Update candidate
    async update(id: number, payload: Partial<CandidateCreateDto>): Promise<CandidateDetailDto> {
        const response = await api.put<ApiResponse<CandidateDetailDto>>(`${this.baseUrl}/${id}`, payload);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update candidate');
    }

    // Delete candidate
    async delete(id: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete candidate');
        }
    }

    // Upload candidate photo
    async uploadPhoto(candidateId: number, file: File): Promise<CandidateDetailDto> {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post<ApiResponse<CandidateDetailDto>>(
            `${this.baseUrl}/${candidateId}/photo`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to upload photo');
    }

    // Delete candidate photo
    async deletePhoto(candidateId: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${candidateId}/photo`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete photo');
        }
    }
}

export const candidateService = new CandidateService();
export default candidateService;
