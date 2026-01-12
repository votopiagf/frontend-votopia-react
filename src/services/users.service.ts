import api from '@/services/api';
import { isDev } from '@/lib/env';
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
// SERVICE
// ============================================================================

class UsersService {
    // ========================================================================
    // INITIALIZATION ENDPOINTS
    // ========================================================================

    async getInitializationDataForUserCreation(): Promise<UserCreationInitDto> {
        const data = await api.get<UserCreationInitDto>('/api/users/init-creation/');
        return data as unknown as UserCreationInitDto;
    }

    async getUsersScreenInitialization(targetListId?: number): Promise<UsersScreenInitDto> {
        const params = targetListId ? { target_list_id: targetListId } : {};
        const data = await api.get<UsersScreenInitDto>('/api/users/init-screen/', { params });

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

        const body = data as unknown as UsersScreenInitDto;

        return {
            availableLists: Array.isArray(body.availableLists) ? body.availableLists : [],
            availableOrgRoles: Array.isArray(body.availableOrgRoles) ? body.availableOrgRoles : [],
            availableListRoles: Array.isArray(body.availableListRoles) ? body.availableListRoles : [],
            statistics: body.statistics ?? { totalUsers: 0, totalRoles: 0, totalLists: 0 },
            filterScope: body.filterScope ?? { canFilterAllOrganization: true, canFilterByList: false, restrictedToListId: null, restrictedToListName: null }
        };
    }

    async getAssignableLists(): Promise<ListOptionDto[]> {
        const data = await api.get<ListOptionDto[]>('/api/users/options/lists');
        return Array.isArray(data) ? data : [];
    }

    async getAssignableRoles(targetListId?: number): Promise<RoleOptionDto[]> {
        const params = targetListId ? { target_list_id: targetListId } : {};
        if (isDev()) {
            console.log('getAssignableRoles params:', params);
        }
        const data = await api.get<RoleOptionDto[]>('/api/users/options/roles', { params });
        if (isDev()) {
            console.log('getAssignableRoles response count:', Array.isArray(data) ? data.length : 0);
        }
        return Array.isArray(data) ? data : [];
    }

    // ========================================================================
    // USER CRUD OPERATIONS
    // ========================================================================

    async register(payload: UserCreate): Promise<UserSummary> {
        const data = await api.post<UserSummary>('/api/users/register/', payload);
        return data as unknown as UserSummary;
    }

    async getInfo(targetUserId?: number): Promise<UserDetail> {
        const params = targetUserId ? { target_user_id: targetUserId } : {};
        const data = await api.get<UserDetail>('/api/users/info/', { params });
        console.log("Result get info"+data);
        return data as unknown as UserDetail;
    }

    async getAll(targetListId?: number): Promise<UserDetail[]> {
        const params = targetListId ? { target_list_id: targetListId } : {};
        if (isDev()) {
            console.log('getAll params:', params);
        }
        const data = await api.get<UserDetail[]>('/api/users/all/', { params });
        if (isDev()) {
            console.log('getAll response count:', Array.isArray(data) ? data.length : 0);
        }
        return Array.isArray(data) ? data : [];
    }

    async delete(targetUserId: number): Promise<void> {
        const params = { target_user_id: targetUserId };
        await api.delete('/api/users/delete/', { params });
    }

    async deleteMany(ids: number[]): Promise<void> {
        const params = new URLSearchParams();
        ids.forEach(id => params.append('ids_target_user', id.toString()));
        await api.delete(`/api/users/delete/list/?${params.toString()}`);
    }

    async update(payload: UserUpdate): Promise<UserSummary> {
        const data = await api.put<UserSummary>('/api/users/update/', payload);
        return data as unknown as UserSummary;
    }

    async updateMany(users: UserUpdate[]): Promise<UserSummary[]> {
        const data = await api.put<UserSummary[]>('/api/users/update/list/', users);
        return Array.isArray(data) ? data : [];
    }

    async registerMany(users: UserCreate[]): Promise<UserSummary[]> {
        const data = await api.post<UserSummary[]>('/api/users/register/list/', users);
        return Array.isArray(data) ? data : [];
    }

    async exportExcel(targetListId?: number): Promise<Blob> {
        const params = targetListId ? { target_list_id: targetListId } : {};
        const response = await api.get('/api/users/all/excel', {
            params,
            responseType: 'blob',
        });
        return response.data as Blob;
    }

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

    async getById(id: number): Promise<UserDetail | null> {
        try {
            return await this.getInfo(id);
        } catch {
            return null;
        }
    }

    async create(payload: UserCreate): Promise<UserSummary> {
        return this.register(payload);
    }

    async deleteById(id: number): Promise<void> {
        return this.delete(id);
    }

    // ========================================================================
    // RELATED ENDPOINTS
    // ========================================================================

    async getRoles(): Promise<RoleSummary[]> {
        const data = await api.get<RoleSummary[]>('api/roles/');
        return Array.isArray(data) ? data : [];
    }

    async getLists(): Promise<ListSummary[]> {
        const data = await api.get<ListSummary[]>('api/lists/');
        return Array.isArray(data) ? data : [];
    }
}

export default new UsersService();
