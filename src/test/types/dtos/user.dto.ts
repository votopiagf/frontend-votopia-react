// DTOs per User - come ricevuti dal server

import type { RoleSummaryDto } from '@/test/types/dtos/role.dto.ts';
import type { ListSummaryDto } from '@/test/types/dtos/list.dto.ts';

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

// ============================================================================
// NEW DTOs for User Screen Initialization
// ============================================================================

export interface ListOptionDto {
    id: number;
    name: string;
}

export interface RoleOptionDto {
    id: number;
    name: string;
    color: string;
    level: number;
    listId?: number | null;
}

/**
 * DTO contenente tutti i dati necessari per inizializzare la schermata di creazione utente.
 */
export interface UserCreationInitDto {
    availableLists: ListOptionDto[];
    availableRoles: RoleOptionDto[];
    availableRolesByList: RoleOptionDto[];
}

/**
 * Statistiche aggregate visibili all'utente
 */
export interface UsersScreenStatistics {
    totalUsers: number;
    totalRoles: number;
    totalLists: number;
}

/**
 * Indica lo scope di filtro disponibile all'utente
 */
export interface UsersScreenFilterScope {
    canFilterAllOrganization: boolean;
    canFilterByList: boolean;
    restrictedToListId: number | null;
    restrictedToListName: string | null;
}

/**
 * DTO contenente TUTTE le informazioni necessarie per inizializzare la schermata Users.
 */
export interface UsersScreenInitDto {
    availableLists: ListOptionDto[];
    availableOrgRoles: RoleOptionDto[];
    availableListRoles: RoleOptionDto[];
    statistics: UsersScreenStatistics;
    filterScope: UsersScreenFilterScope;
}

