import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
    ListCreateDto,
    ListUpdateDto,
    ListDetailDto,
    ListSummaryDto
} from '@/types/dtos/list.dto';
import type { SchoolSummaryDto } from '@/types/dtos/school.dto';
import type { UserSummaryDto } from '@/types/dtos/user.dto';

class ListService {
    private readonly baseUrl = '/api/lists';

    // Get all lists
    async getAll(): Promise<ListSummaryDto[]> {
        const response = await api.get<ApiResponse<ListSummaryDto[]>>(this.baseUrl);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch lists');
    }

    // Get list by ID
    async getById(id: number): Promise<ListDetailDto> {
        const response = await api.get<ApiResponse<ListDetailDto>>(`${this.baseUrl}/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch list');
    }

    // Get lists by school ID
    async getBySchoolId(schoolId: number): Promise<ListSummaryDto[]> {
        const response = await api.get<ApiResponse<ListSummaryDto[]>>(`${this.baseUrl}/school/${schoolId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch lists by school');
    }

    // Create new list
    async create(payload: ListCreateDto): Promise<ListDetailDto> {
        const response = await api.post<ApiResponse<ListDetailDto>>(this.baseUrl, payload);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create list');
    }

    // Update list
    async update(id: number, payload: Partial<ListUpdateDto>): Promise<ListDetailDto> {
        const response = await api.put<ApiResponse<ListDetailDto>>(`${this.baseUrl}/${id}`, {
            ...payload,
            listId: id
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update list');
    }

    // Delete list
    async deleteById(id: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete list');
        }
    }

    // Upload logo file for list
    async uploadLogo(listId: number, file: File): Promise<ListDetailDto> {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post<ApiResponse<ListDetailDto>>(
            `${this.baseUrl}/${listId}/logo`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to upload logo');
    }

    // Delete logo from list
    async deleteLogo(listId: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${listId}/logo`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete logo');
        }
    }

    // Get schools for list assignment
    async getSchools(): Promise<SchoolSummaryDto[]> {
        const response = await api.get<ApiResponse<SchoolSummaryDto[]>>('/api/schools');
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch schools');
    }

    // Get users assigned to a list
    async getUsersByListId(listId: number): Promise<UserSummaryDto[]> {
        const response = await api.get<ApiResponse<UserSummaryDto[]>>(`${this.baseUrl}/${listId}/users`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch users by list');
    }

    // Add users to list
    async addUsers(listId: number, userIds: number[]): Promise<void> {
        const response = await api.post<ApiResponse<void>>(`${this.baseUrl}/${listId}/users`, { userIds });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to add users to list');
        }
    }

    // Remove users from list
    async removeUsers(listId: number, userIds: number[]): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${listId}/users`, {
            data: { userIds }
        });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to remove users from list');
        }
    }
}

export const listsService = new ListService();
export default listsService;