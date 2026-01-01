// DTOs per User - come ricevuti dal server

import type { RoleSummaryDto } from '@/types/dtos/role.dto';
import type { ListSummaryDto } from '@/types/dtos/list.dto';

export interface UserCreateDto {
    name: string;
    surname: string;
    email: string;
    password: string;
    rolesId?: number[];
    listsId?: number[];
}

export interface UserUpdateDto {
    id: number;
    name?: string;
    surname?: string;
    email?: string;
    resetPassword?: boolean;
    addLists?: number[];
    removeLists?: number[];
}

export interface UserDetailDto {
    id: number;
    name: string;
    surname: string;
    email: string;
    roles: RoleSummaryDto[];
    deleted: boolean;
    mustChangePassword: boolean;
    list: ListSummaryDto[];
}

export interface UserSummaryDto {
    id: number;
    name: string;
    surname: string;
    email: string;
    roles: RoleSummaryDto[];
}
