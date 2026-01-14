// DTOs per autenticazione - come ricevuti dal server

// DTOs per autenticazione - come ricevuti dal server
import type {UserSummaryDto} from "@/test/types/dtos/user.dto.ts";

export interface LoginRequestDto {
    codeOrg: string;
    email: string;
    password: string;
}

export interface LoginSummaryDto {
    token: string;
    userSummaryDto: UserSummaryDto;
}
