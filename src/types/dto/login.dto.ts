import {UserSummary} from "@/types/user.types.ts";

export interface LoginResponse {
    token: string;
    userSummaryDto?: UserSummary
}