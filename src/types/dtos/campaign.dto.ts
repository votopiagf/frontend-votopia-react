// DTOs per Campaign - come ricevuti dal server

export interface CampaignCreateDto {
    name: string;
    listId: number;
    description?: string;
    startDate: string;
    endDate: string;
}

export interface CampaignUpdateDto {
    id: number;
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export interface CampaignSummaryDto {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    listId: number | null;
    listName: string | null;
}

export interface CampaignAddCandidateDto {
    candidateId: number;
    campaignId: number;
    positionInList?: number;
    positonId?: number;
}
