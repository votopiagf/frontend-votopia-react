// DTOs per School - come ricevuti dal server

export interface SchoolCreateDto {
    name: string;
    addressStreet: string;
    city: string;
    schoolCode: string;
}

export interface SchoolUpdateDto {
    id: number;
    name?: string;
    addressStreet?: string;
    city?: string;
    schoolCode?: string;
}

export interface SchoolDetailDto {
    id: number;
    name: string;
    addressStreet: string;
    city: string;
    schoolCode: string;
    createdAt: string;
}

export interface SchoolSummaryDto {
    id: number;
    name: string;
    addressStreet: string;
    city: string;
}
