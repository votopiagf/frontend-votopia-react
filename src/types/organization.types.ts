export interface OrganizationBasicInfo{
    id: bigint;
    code: string,
    name: string,
    status: OrganizationStatus,
}

enum OrganizationStatus{
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}