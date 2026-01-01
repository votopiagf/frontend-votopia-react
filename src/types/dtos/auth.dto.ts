// DTOs per autenticazione - come ricevuti dal server

// DTOs per autenticazione - come ricevuti dal server
import type {UserSummaryDto} from "@/types/dtos/user.dto";

export interface LoginRequestDto {
    codeOrg: string;
    email: string;
    password: string;
}

export interface LoginSummaryDto {
    token: string;
    userSummaryDto: UserSummaryDto;
}
