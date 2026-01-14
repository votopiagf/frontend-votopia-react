// Types per Campaign - uso interno frontend

export interface CampaignCreate {
    name: string;
    listId: number;
    description?: string;
    startDate: string | Date;
    endDate: string | Date;
}

export interface CampaignUpdate {
    id: number;
    name?: string;
    description?: string;
    startDate?: string | Date;
    endDate?: string | Date;
}

export interface CampaignSummary {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    listId: number | null;
    listName: string | null;
    isActive?: boolean; // Computed: controlla se la campagna è attiva
    daysRemaining?: number; // Computed: giorni rimanenti
}

export interface CampaignAddCandidate {
    candidateId: number;
    campaignId: number;
    positionInList?: number;
    positionId?: number;
}

export interface CampaignState {
    campaigns: CampaignSummary[];
    selectedCampaign: CampaignSummary | null;
    loading: boolean;
    error: string | null;
}
