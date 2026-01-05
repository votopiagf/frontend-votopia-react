import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
    UserCreateDto,
    UserUpdateDto,
    UserDetailDto,
    UserSummaryDto
} from '@/types/dtos/user.dto';

class UserService {
    private readonly baseUrl = '/api/users';

    // Get all users
    async getAll(): Promise<UserDetailDto[]> {
        const response = await api.get<ApiResponse<UserDetailDto[]>>(this.baseUrl);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch users');
    }

    // Get user by ID
    async getById(id: number): Promise<UserDetailDto> {
        const response = await api.get<ApiResponse<UserDetailDto>>(`${this.baseUrl}/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch user');
    }

    // Get user by email
    async getByEmail(email: string): Promise<UserDetailDto> {
        const response = await api.get<ApiResponse<UserDetailDto>>(`${this.baseUrl}/by-email`, {
            params: { email }
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch user by email');
    }

    // Get users by list ID
    async getByListId(listId: number): Promise<UserSummaryDto[]> {
        const response = await api.get<ApiResponse<UserSummaryDto[]>>(`${this.baseUrl}/list/${listId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch users by list');
    }

    // Create new user
    async create(payload: UserCreateDto): Promise<UserDetailDto> {
        const response = await api.post<ApiResponse<UserDetailDto>>(this.baseUrl, payload);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create user');
    }

    // Update user
    async update(id: number, payload: Partial<UserUpdateDto>): Promise<UserDetailDto> {
        const response = await api.put<ApiResponse<UserDetailDto>>(`${this.baseUrl}/${id}`, {
            ...payload,
            id
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update user');
    }

    // Delete user by ID
    async deleteById(id: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete user');
        }
    }

    // Delete multiple users
    async deleteMany(ids: number[]): Promise<void> {
        const response = await api.post<ApiResponse<void>>(`${this.baseUrl}/delete-many`, { ids });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete users');
        }
    }

    // Add user to lists
    async addToLists(userId: number, listIds: number[]): Promise<UserDetailDto> {
        const response = await api.put<ApiResponse<UserDetailDto>>(`${this.baseUrl}/${userId}`, {
            id: userId,
            addLists: listIds
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to add user to lists');
    }

    // Remove user from lists
    async removeFromLists(userId: number, listIds: number[]): Promise<UserDetailDto> {
        const response = await api.put<ApiResponse<UserDetailDto>>(`${this.baseUrl}/${userId}`, {
            id: userId,
            removeLists: listIds
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to remove user from lists');
    }

    // Reset user password
    async resetPassword(userId: number): Promise<UserDetailDto> {
        const response = await api.put<ApiResponse<UserDetailDto>>(`${this.baseUrl}/${userId}`, {
            id: userId,
            resetPassword: true
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to reset password');
    }
}

export const userService = new UserService();
export default userService;