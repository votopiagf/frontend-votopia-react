export interface UserSummary {
    id: bigint;
    name: string;
    surname: string;
    email: string;
    organization: OrganizationSummary;
    
}