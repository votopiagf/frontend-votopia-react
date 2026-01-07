import api from '@/services/api';
import type { UserSummary, UserDetail, UserCreate, UserUpdate } from '@/types/user.types';
import type { RoleSummary } from '@/types/role.types';
import type { ListSummary } from '@/types/list.types';
import type {
    UserCreationInitDto,
    UsersScreenInitDto,
    ListOptionDto,
    RoleOptionDto
} from '@/types/dtos/user.dto';

// ============================================================================
// TYPES
// ============================================================================

interface ApiResponse<T> {
    success: boolean;
    status: number;
    data: T;
    message: string;
    timestamp: number;
}

// ============================================================================
// HELPERS
// ============================================================================

function unwrapResponse<T>(res: { data: ApiResponse<T> } | { data: T } | T): T {
    if (!res) return null as unknown as T;

    // Shape: { data: { data: T } } (ApiResponse wrapper)
    const r = res as { data?: { data?: T; success?: boolean } };
    if (r.data && 'success' in r.data && r.data.data !== undefined) {
        return r.data.data;
    }

    // Shape: { data: T }
    if (r.data !== undefined) {
        return r.data as T;
    }

    return res as T;
}

// ============================================================================
// SERVICE
// ============================================================================

class UsersService {
    // ========================================================================
    // INITIALIZATION ENDPOINTS
    // ========================================================================

    /**
     * Inizializza la schermata di creazione utente
     * GET /api/users/init-creation/
     * Restituisce liste e ruoli disponibili per la creazione utente
     */
    async getInitializationDataForUserCreation(): Promise<UserCreationInitDto> {
        const res = await api.get<ApiResponse<UserCreationInitDto>>('api/users/init-creation/');
        return unwrapResponse(res);
    }

    /**
     * Inizializza la schermata Users completa
     * GET /api/users/init-screen/
     * Restituisce TUTTI i dati: liste, ruoli, statistiche e scope di filtro
     */
    async getUsersScreenInitialization(targetListId?: number): Promise<UsersScreenInitDto> {
        const params = targetListId ? { target_list_id: targetListId } : {};
        const res = await api.get<ApiResponse<UsersScreenInitDto>>('api/users/init-screen/', { params });
        const data = unwrapResponse(res);

        // Validazione e fallback
        if (!data) {
            console.warn('⚠️ getUsersScreenInitialization restituisce null, ritorno dati vuoti');
            return {
                availableLists: [],
                availableOrgRoles: [],
                availableListRoles: [],
                statistics: { totalUsers: 0, totalRoles: 0, totalLists: 0 },
                filterScope: { canFilterAllOrganization: true, canFilterByList: false, restrictedToListId: null, restrictedToListName: null }
            };
        }

        return {
            availableLists: Array.isArray(data.availableLists) ? data.availableLists : [],
            availableOrgRoles: Array.isArray(data.availableOrgRoles) ? data.availableOrgRoles : [],
            availableListRoles: Array.isArray(data.availableListRoles) ? data.availableListRoles : [],
            statistics: data.statistics ?? { totalUsers: 0, totalRoles: 0, totalLists: 0 },
            filterScope: data.filterScope ?? { canFilterAllOrganization: true, canFilterByList: false, restrictedToListId: null, restrictedToListName: null }
        };
    }

    /**
     * Ottieni liste assegnabili per creazione utente
     * GET /api/users/options/lists
     */
    async getAssignableLists(): Promise<ListOptionDto[]> {
        const res = await api.get<ApiResponse<ListOptionDto[]>>('api/users/options/lists');
        const data = unwrapResponse(res);
        return Array.isArray(data) ? data : [];
    }

    /**
     * Ottieni ruoli assegnabili per creazione utente
     * GET /api/users/options/roles?target_list_id={id}
     */
    async getAssignableRoles(targetListId?: number): Promise<RoleOptionDto[]> {
        const params = targetListId ? { target_list_id: targetListId } : {};
        if (import.meta.env.DEV) {
            console.log('getAssignableRoles params:', params);
        }
        const res = await api.get<ApiResponse<RoleOptionDto[]>>('api/users/options/roles', { params });
        const data = unwrapResponse(res);
        if (import.meta.env.DEV) {
            console.log('getAssignableRoles response count:', Array.isArray(data) ? data.length : 0);
        }
        return Array.isArray(data) ? data : [];
    }

    // ========================================================================
    // USER CRUD OPERATIONS
    // ========================================================================

    /**
     * Registra un nuovo utente
     * POST /api/users/register/
     */
    async register(payload: UserCreate): Promise<UserSummary> {
        const res = await api.post<ApiResponse<UserSummary>>('api/users/register/', payload);
        return unwrapResponse(res);
    }

    /**
     * Ottieni informazioni utente
     * GET /api/users/info/?target_user_id={id}
     * Se target_user_id è omesso, restituisce l'utente corrente
     */
    async getInfo(targetUserId?: number): Promise<UserDetail> {
        const params = targetUserId ? { target_user_id: targetUserId } : {};
        const res = await api.get<ApiResponse<UserDetail>>('api/users/info/', { params });
        console.log("Result get info"+res);
        return unwrapResponse(res);
    }

    /**
     * Lista tutti gli utenti visibili
     * GET /api/users/all/?target_list_id={id}
     */
    async getAll(targetListId?: number): Promise<UserDetail[]> {
        const params = targetListId ? { target_list_id: targetListId } : {};
        if (import.meta.env.DEV) {
            console.log('getAll params:', params);
        }
        const res = await api.get<ApiResponse<UserDetail[]>>('api/users/all/', { params });
        const data = unwrapResponse(res);
        if (import.meta.env.DEV) {
            console.log('getAll response count:', Array.isArray(data) ? data.length : 0);
        }
        return Array.isArray(data) ? data : [];
    }

    /**
     * Elimina un utente
     * DELETE /api/users/delete/?target_user_id={id}
     */
    async delete(targetUserId: number): Promise<void> {
        const params = { target_user_id: targetUserId };
        await api.delete('api/users/delete/', { params });
    }

    /**
     * Elimina una lista di utenti
     * DELETE /api/users/delete/list/?ids_target_user={id1}&ids_target_user={id2}
     */
    async deleteMany(ids: number[]): Promise<void> {
        const params = new URLSearchParams();
        ids.forEach(id => params.append('ids_target_user', id.toString()));
        await api.delete(`api/users/delete/list/?${params.toString()}`);
    }

    /**
     * Aggiorna profilo utente
     * PUT /api/users/update/
     */
    async update(payload: UserUpdate): Promise<UserSummary> {
        const res = await api.put<ApiResponse<UserSummary>>('api/users/update/', payload);
        return unwrapResponse(res);
    }

    /**
     * Modifica una lista di utenti
     * PUT /api/users/update/list/
     */
    async updateMany(users: UserUpdate[]): Promise<UserSummary[]> {
        const res = await api.put<ApiResponse<UserSummary[]>>('api/users/update/list/', users);
        const data = unwrapResponse(res);
        return Array.isArray(data) ? data : [];
    }

    /**
     * Registra una lista di utenti
     * POST /api/users/register/list/
     */
    async registerMany(users: UserCreate[]): Promise<UserSummary[]> {
        const res = await api.post<ApiResponse<UserSummary[]>>('api/users/register/list/', users);
        const data = unwrapResponse(res);
        return Array.isArray(data) ? data : [];
    }

    /**
     * Esporta utenti in Excel
     * GET /api/users/all/excel?target_list_id={id}
     * Restituisce un Blob per il download
     */
    async exportExcel(targetListId?: number): Promise<Blob> {
        const params = targetListId ? { target_list_id: targetListId } : {};
        const res = await api.get('api/users/all/excel', {
            params,
            responseType: 'blob',
        });
        return res.data as Blob;
    }

    /**
     * Helper per scaricare il file Excel
     */
    async downloadExcel(targetListId?: number, filename = 'users.xlsx'): Promise<void> {
        const blob = await this.exportExcel(targetListId);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }

    // ========================================================================
    // HELPER METHODS (per compatibilità con il codice esistente)
    // ========================================================================

    /**
     * Get user by ID (alias per getInfo)
     */
    async getById(id: number): Promise<UserDetail | null> {
        try {
            return await this.getInfo(id);
        } catch {
            return null;
        }
    }

    /**
     * Create a new user (alias per register)
     */
    async create(payload: UserCreate): Promise<UserSummary> {
        return this.register(payload);
    }

    /**
     * Delete a user by ID (alias per delete)
     */
    async deleteById(id: number): Promise<void> {
        return this.delete(id);
    }

    // ========================================================================
    // RELATED ENDPOINTS
    // ========================================================================

    /**
     * Get all roles
     */
    async getRoles(): Promise<RoleSummary[]> {
        const res = await api.get<ApiResponse<RoleSummary[]>>('api/roles/');
        const data = unwrapResponse(res);
        return Array.isArray(data) ? data : [];
    }

    /**
     * Get all lists
     */
    async getLists(): Promise<ListSummary[]> {
        const res = await api.get<ApiResponse<ListSummary[]>>('api/lists/');
        const data = unwrapResponse(res);
        return Array.isArray(data) ? data : [];
    }
}

export default new UsersService();
