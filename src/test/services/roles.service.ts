// import api from '@/services/api';
// import type { RoleCreate, RoleUpdate, RoleDetail } from '@/types/role.types';
// import type { RoleSummaryDto, RoleDetailDto, RoleInfoResponse } from '@/types/dtos/role.dto';
// import type { ListSummary } from '@/types/list.types';

// export interface RolesScreenInitDto {
//     availableOrgRoles?: RoleSummaryDto[] | RoleDetailDto[];
//     availableListRoles?: RoleSummaryDto[] | RoleDetailDto[];
//     statistics?: {
//         totalRoles: number;
//         orgRoles: number;
//         listRoles: number;
//     };
//     permissions?: {
//         canCreateOrgRole: boolean;
//         canCreateListRole: boolean;
//     };
// }

// class RolesService {
//     /**
//      * Inizializza i dati per la schermata dei ruoli
//      * GET /api/roles/init-screen/
//      */
//     async getRolesScreenInitialization(): Promise<RolesScreenInitDto> {
//         const data = await api.get<RolesScreenInitDto>('api/roles/init-screen/');
//         return data as unknown as RolesScreenInitDto;
//     }

//     /**
//      * Recupera tutti i ruoli visibili
//      * GET /api/roles/all/?target_list_id={id}
//      */
//     async getAll(targetListId?: number): Promise<RoleSummaryDto[]> {
//         const params = targetListId ? { target_list_id: targetListId } : {};
//         const data = await api.get<RoleSummaryDto[]>('api/roles/all/', { params });
//         return Array.isArray(data) ? data : [];
//     }

//     /**
//      * Ottieni dettagli completi di un ruolo
//      * GET /api/roles/info/?target_role_id={id}
//      */
//     async getInfo(targetRoleId: number): Promise<RoleInfoResponse> {
//         const params = { target_role_id: targetRoleId };
//         const data = await api.get<RoleInfoResponse>('api/roles/info/', { params });
//         return data as unknown as RoleInfoResponse;
//     }

//     /**
//      * Crea un nuovo ruolo
//      * POST /api/roles/create/
//      */
//     async create(payload: RoleCreate): Promise<RoleDetail> {
//         const data = await api.post<RoleDetail>('api/roles/create/', payload);
//         return data as unknown as RoleDetail;
//     }

//     /**
//      * Aggiorna un ruolo
//      * PUT /api/roles/update/
//      */
//     async update(payload: RoleUpdate): Promise<RoleDetail> {
//         const data = await api.put<RoleDetail>('api/roles/update/', payload);
//         return data as unknown as RoleDetail;
//     }

//     /**
//      * Elimina un ruolo
//      * DELETE /api/roles/delete/?target_role_id={id}
//      */
//     async delete(targetRoleId: number): Promise<void> {
//         await api.delete('api/roles/delete/', { params: { target_role_id: targetRoleId } });
//     }

//     /**
//      * Get all lists (per il select delle liste)
//      */
//     async getLists(): Promise<ListSummary[]> {
//         const data = await api.get<ListSummary[]>('api/lists/all/');
//         return Array.isArray(data) ? data : [];
//     }
// }

// export const rolesService = new RolesService();
// export default rolesService;

// */


import api from "@/test/services/api.ts";
import type { RoleCreate, RoleUpdate, RoleDetail } from "@/test/types/role.types.ts";
import type { RoleSummaryDto, RoleDetailDto, RoleInfoResponse } from "@/test/types/dtos";
import type { ListSummary } from "@/test/types/list.types.ts";

export interface RolesScreenInitDto {
    availableOrgRoles?: RoleSummaryDto[] | RoleDetailDto[];
    availableListRoles?: RoleSummaryDto[] | RoleDetailDto[];
    statistics?: {
        totalRoles: number;
        orgRoles: number;
        listRoles: number;
    };
    permissions?: {
        canCreateOrgRole: boolean;
        canCreateListRole: boolean;
    };
}

class RolesService {
    async getRolesScreenInitialization(): Promise<RolesScreenInitDto> {
        const data = await api.get<RolesScreenInitDto>('api/roles/init-screen/');
        return data as unknown as RolesScreenInitDto;
    }

    async getAll(targetListId?: number): Promise<RoleSummaryDto[]> {
        const params = targetListId ? { target_list_id: targetListId } : {};
        const data = await api.get<RoleSummaryDto[]>('api/roles/all/', { params });
        return Array.isArray(data) ? data : [];
    }

    async getInfo(targetRoleId: number): Promise<RoleInfoResponse> {
        const params = { target_role_id: targetRoleId };
        const data = await api.get<RoleInfoResponse>('api/roles/info/', { params });
        return data as unknown as RoleInfoResponse;
    }

    async create(payload: RoleCreate): Promise<RoleDetail> {
        const data = await api.post<RoleDetail>('api/roles/create/', payload);
        return data as unknown as RoleDetail;
    }

    async update(payload: RoleUpdate): Promise<RoleDetail> {
        const data = await api.put<RoleDetail>('api/roles/update/', payload);
        return data as unknown as RoleDetail;
    }

    async delete(targetRoleId: number): Promise<void> {
        await api.delete('api/roles/delete/', { params: { target_role_id: targetRoleId } });
    }

    async getLists(): Promise<ListSummary[]> {
        const data = await api.get<ListSummary[]>('api/lists/all/');
        return Array.isArray(data) ? data : [];
    }
}

export const rolesService = new RolesService();
export default rolesService;

