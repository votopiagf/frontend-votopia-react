import type {UserSummary} from "@/types/user.types";

export interface LoginSummaryDto {
    token: string;
    userSummary: UserSummary;
}