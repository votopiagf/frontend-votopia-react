import type {UserSummary} from "@/test/types/user.types.ts";

export interface LoginSummaryDto {
    token: string;
    userSummary: UserSummary;
}