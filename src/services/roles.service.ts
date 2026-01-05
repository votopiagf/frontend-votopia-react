import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
    RoleCreateDto,
    RoleUpdateDto,
    RoleDetailDto,
    RoleSummaryDto,
    RoleInfoResponse
} from '@/types/dtos/role.dto';
import type { ListSummaryDto } from '@/types/dtos/list.dto';
import type { PermissionSummaryDto } from '@/types/dtos/permission.dto';

class RoleService {
    private readonly baseUrl = '/api/roles';

    // Get all roles
    async getAll(): Promise<RoleDetailDto[]> {
        const response = await api.get<ApiResponse<RoleDetailDto[]>>(this.baseUrl);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch roles');
    }

    // Get role by ID
    async getById(id: number): Promise<RoleDetailDto> {
        const response = await api.get<ApiResponse<RoleDetailDto>>(`${this.baseUrl}/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch role');
    }

    // Get roles by list ID
    async getByListId(listId: number): Promise<RoleSummaryDto[]> {
        const response = await api.get<ApiResponse<RoleSummaryDto[]>>(`${this.baseUrl}/list/${listId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch roles by list');
    }

    // Get roles by organization ID
    async getByOrganizationId(organizationId: number): Promise<RoleSummaryDto[]> {
        const response = await api.get<ApiResponse<RoleSummaryDto[]>>(`${this.baseUrl}/organization/${organizationId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch roles by organization');
    }

    // Get role info (roles with user roles count)
    async getRoleInfo(): Promise<RoleInfoResponse> {
        const response = await api.get<ApiResponse<RoleInfoResponse>>(`${this.baseUrl}/info`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch role info');
    }

    // Create new role
    async create(payload: RoleCreateDto): Promise<RoleDetailDto> {
        const response = await api.post<ApiResponse<RoleDetailDto>>(this.baseUrl, payload);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create role');
    }

    // Update role
    async update(id: number, payload: Partial<RoleUpdateDto>): Promise<RoleDetailDto> {
        const response = await api.put<ApiResponse<RoleDetailDto>>(`${this.baseUrl}/${id}`, {
            ...payload,
            id
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update role');
    }

    // Delete role
    async deleteById(id: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete role');
        }
    }

    // Add permissions to role
    async addPermissions(roleId: number, permissionIds: number[]): Promise<RoleDetailDto> {
        const response = await api.put<ApiResponse<RoleDetailDto>>(`${this.baseUrl}/${roleId}`, {
            id: roleId,
            permissions: permissionIds
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to add permissions');
    }

    // Remove permission from role
    async removePermission(roleId: number, permissionId: number): Promise<RoleDetailDto> {
        const response = await api.delete<ApiResponse<RoleDetailDto>>(
            `${this.baseUrl}/${roleId}/permission/${permissionId}`
        );
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to remove permission');
    }

    // Get available lists for role assignment
    async getLists(): Promise<ListSummaryDto[]> {
        const response = await api.get<ApiResponse<ListSummaryDto[]>>('/api/lists');
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch lists');
    }

    // Get available permissions
    async getPermissions(): Promise<PermissionSummaryDto[]> {
        const response = await api.get<ApiResponse<PermissionSummaryDto[]>>('/api/permissions');
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch permissions');
    }
}

export const roleService = new RoleService();
export default roleService;