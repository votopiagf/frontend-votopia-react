import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
    CampaignCreateDto,
    CampaignUpdateDto,
    CampaignSummaryDto,
    CampaignAddCandidateDto,
    CampaignResultsDto
} from '@/types/dtos/campaign.dto';

class CampaignService {
    private readonly baseUrl = '/api/campaigns';

    // Get all campaigns
    async getAll(): Promise<CampaignSummaryDto[]> {
        const response = await api.get<ApiResponse<CampaignSummaryDto[]>>(this.baseUrl);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch campaigns');
    }

    // Get campaign by ID
    async getById(id: number): Promise<CampaignSummaryDto> {
        const response = await api.get<ApiResponse<CampaignSummaryDto>>(`${this.baseUrl}/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch campaign');
    }

    // Get campaigns by list ID
    async getByListId(listId: number): Promise<CampaignSummaryDto[]> {
        const response = await api.get<ApiResponse<CampaignSummaryDto[]>>(`${this.baseUrl}/list/${listId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch campaigns by list');
    }

    // Create new campaign
    async create(payload: CampaignCreateDto): Promise<CampaignSummaryDto> {
        const response = await api.post<ApiResponse<CampaignSummaryDto>>(this.baseUrl, payload);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create campaign');
    }

    // Update campaign
    async update(id: number, payload: Partial<CampaignUpdateDto>): Promise<CampaignSummaryDto> {
        const response = await api.put<ApiResponse<CampaignSummaryDto>>(`${this.baseUrl}/${id}`, {
            ...payload,
            id
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update campaign');
    }

    // Delete campaign
    async delete(id: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete campaign');
        }
    }

    // Add candidate to campaign
    async addCandidate(payload: CampaignAddCandidateDto): Promise<void> {
        const response = await api.post<ApiResponse<void>>(`${this.baseUrl}/add-candidate`, payload);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to add candidate to campaign');
        }
    }

    // Remove candidate from campaign
    async removeCandidate(campaignId: number, candidateId: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(
            `${this.baseUrl}/${campaignId}/candidate/${candidateId}`
        );
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to remove candidate from campaign');
        }
    }

    // Start campaign
    async start(id: number): Promise<void> {
        const response = await api.post<ApiResponse<void>>(`${this.baseUrl}/${id}/start`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to start campaign');
        }
    }

    // Stop campaign
    async stop(id: number): Promise<void> {
        const response = await api.post<ApiResponse<void>>(`${this.baseUrl}/${id}/stop`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to stop campaign');
        }
    }

    // Get campaign results
    async getResults(id: number): Promise<CampaignResultsDto> {
        const response = await api.get<ApiResponse<CampaignResultsDto>>(`${this.baseUrl}/${id}/results`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch campaign results');
    }
}

export const campaignService = new CampaignService();
export default campaignService;
