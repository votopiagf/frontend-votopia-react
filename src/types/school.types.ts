// Types per School - uso interno frontend

export interface SchoolCreate {
    name: string;
    addressStreet: string;
    city: string;
    schoolCode: string;
}

export interface SchoolUpdate {
    id: number;
    name?: string;
    addressStreet?: string;
    city?: string;
    schoolCode?: string;
}

export interface SchoolDetail {
    id: number;
    name: string;
    addressStreet: string;
    city: string;
    schoolCode: string;
    createdAt: Date;
}

export interface SchoolSummary {
    id: number;
    name: string;
    addressStreet: string;
    city: string;
    fullAddress?: string; // Computed per visualizzazione
}

export interface SchoolState {
    schools: SchoolSummary[];
    selectedSchool: SchoolDetail | null;
    loading: boolean;
    error: string | null;
}
