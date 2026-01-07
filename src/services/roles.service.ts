import api from '@/services/api';
import type { RoleCreate, RoleUpdate, RoleDetail } from '@/types/role.types';
import type { ListSummary } from '@/types/list.types';
import type { ApiResponse } from '@/types/api.types';
import type { RoleSummaryDto, RoleDetailDto } from '@/types/dtos/role.dto';

// RoleInfoResponse dal backend
export interface RoleInfoResponse {
    role: RoleDetail;
    permissions: { id: number; name: string; description?: string }[];
}

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

// ============================================================================
// HELPERS
// ============================================================================

type ApiShape<T> = { data?: ApiResponse<T> } | { data?: T } | T;

function unwrapResponse<T>(res: ApiShape<T>): T {
    const asApi = res as { data?: ApiResponse<T> };
    if (asApi?.data && typeof asApi.data === 'object' && 'success' in asApi.data) {
        const apiData = asApi.data as ApiResponse<T>;
        if ((apiData as any).success === true && (apiData as any).data !== undefined) {
            return (apiData as any).data as T;
        }
    }
    const asData = res as { data?: T };
    if (asData?.data !== undefined) return asData.data as T;
    return res as T;
}

class RolesService {
    /**
     * Inizializza i dati per la schermata dei ruoli
     * GET /api/roles/init-screen/
     */
    async getRolesScreenInitialization(): Promise<RolesScreenInitDto> {
        const res = await api.get<ApiResponse<RolesScreenInitDto>>('api/roles/init-screen/');
        const raw = unwrapResponse(res);
        const data = raw || {};
        const availableOrgRoles = Array.isArray(data.availableOrgRoles) ? data.availableOrgRoles : [];
        const availableListRoles = Array.isArray(data.availableListRoles) ? data.availableListRoles : [];
        const statistics = data.statistics ?? { totalRoles: 0, orgRoles: 0, listRoles: 0 };
        const permissions = data.permissions ?? { canCreateOrgRole: false, canCreateListRole: false };
        return { availableOrgRoles, availableListRoles, statistics, permissions };
    }

    /**
     * Recupera tutti i ruoli visibili
     * GET /api/roles/all/?target_list_id={id}
     */
    async getAll(targetListId?: number): Promise<RoleSummaryDto[]> {
        const params = targetListId ? { target_list_id: targetListId } : {};
        const res = await api.get<ApiResponse<RoleSummaryDto[]>>('api/roles/all/', { params });
        const data = unwrapResponse(res);
        return Array.isArray(data) ? data : [];
    }

    /**
     * Ottieni dettagli completi di un ruolo
     * GET /api/roles/info/?target_role_id={id}
     */
    async getInfo(targetRoleId: number): Promise<RoleInfoResponse> {
        const res = await api.get<ApiResponse<RoleInfoResponse>>('api/roles/info/', {
            params: { target_role_id: targetRoleId },
        });
        return unwrapResponse(res);
    }

    /**
     * Crea un nuovo ruolo
     * POST /api/roles/create/
     */
    async create(payload: RoleCreate): Promise<RoleDetail> {
        const res = await api.post<ApiResponse<RoleDetail>>('api/roles/register/', payload);
        return unwrapResponse(res);
    }

    /**
     * Aggiorna un ruolo
     * PUT /api/roles/update/
     */
    async update(payload: RoleUpdate): Promise<RoleDetail> {
        const res = await api.put<ApiResponse<RoleDetail>>('api/roles/update/', payload);
        return unwrapResponse(res);
    }

    /**
     * Elimina un ruolo
     * DELETE /api/roles/delete/?target_role_id={id}
     */
    async delete(targetRoleId: number): Promise<void> {
        await api.delete('api/roles/delete/', { params: { target_role_id: targetRoleId } });
    }

    /**
     * Get all lists (per il select delle liste)
     */
    async getLists(): Promise<ListSummary[]> {
        const res = await api.get<ApiResponse<ListSummary[]>>('api/lists/');
        const data = unwrapResponse(res);
        return Array.isArray(data) ? data : [];
    }
}

export const rolesService = new RolesService();
export default rolesService;

