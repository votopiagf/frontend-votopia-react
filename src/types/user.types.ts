import type {RoleSummary} from "@/test/types";

export interface UserSummary {
    id: number;
    name: string;
    surname: string;
    email: string;
    roles: RoleSummary[];
}

export interface UserDisplay {
    id: number;
    fullName: string;
    email: string;
    roles: string[];
}

export interface Statistics {
    totalUsers: number;
    totalRoles: number;
    totalList: number;
}