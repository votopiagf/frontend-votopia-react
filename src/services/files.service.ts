import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
    FileDetailDto,
    FileSummaryDto,
    FileCategory
} from '@/types/dtos/file.dto';

class FileService {
    private readonly baseUrl = '/api/files';

    // Get all files
    async getAll(): Promise<FileDetailDto[]> {
        const response = await api.get<ApiResponse<FileDetailDto[]>>(this.baseUrl);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch files');
    }

    // Get file by ID
    async getById(id: number): Promise<FileDetailDto> {
        const response = await api.get<ApiResponse<FileDetailDto>>(`${this.baseUrl}/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch file');
    }

    // Get files by list ID
    async getByListId(listId: number): Promise<FileDetailDto[]> {
        const response = await api.get<ApiResponse<FileDetailDto[]>>(`${this.baseUrl}/list/${listId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch files by list');
    }

    // Get files by user ID
    async getByUserId(userId: number): Promise<FileDetailDto[]> {
        const response = await api.get<ApiResponse<FileDetailDto[]>>(`${this.baseUrl}/user/${userId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch files by user');
    }

    // Get files by category
    async getByCategory(categoryId: number): Promise<FileDetailDto[]> {
        const response = await api.get<ApiResponse<FileDetailDto[]>>(`${this.baseUrl}/category/${categoryId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch files by category');
    }

    // Upload file
    async upload(file: File, listId?: number, categoryId?: number): Promise<FileDetailDto> {
        const formData = new FormData();
        formData.append('file', file);
        if (listId) {
            formData.append('listId', listId.toString());
        }
        if (categoryId) {
            formData.append('categoryId', categoryId.toString());
        }

        const response = await api.post<ApiResponse<FileDetailDto>>(
            `${this.baseUrl}/upload`,
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
        throw new Error(response.data.message || 'Failed to upload file');
    }

    // Upload multiple files
    async uploadMultiple(files: File[], listId?: number, categoryId?: number): Promise<FileDetailDto[]> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        if (listId) {
            formData.append('listId', listId.toString());
        }
        if (categoryId) {
            formData.append('categoryId', categoryId.toString());
        }

        const response = await api.post<ApiResponse<FileDetailDto[]>>(
            `${this.baseUrl}/upload-multiple`,
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
        throw new Error(response.data.message || 'Failed to upload files');
    }

    // Download file
    async download(id: number): Promise<Blob> {
        const response = await api.get<Blob>(`${this.baseUrl}/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    }

    // Delete file
    async deleteById(id: number): Promise<void> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete file');
        }
    }

    // Delete multiple files
    async deleteMany(ids: number[]): Promise<void> {
        const response = await api.post<ApiResponse<void>>(`${this.baseUrl}/delete-many`, { ids });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete files');
        }
    }

    // Update file metadata
    async update(id: number, payload: { name?: string; categoryId?: number }): Promise<FileDetailDto> {
        const response = await api.put<ApiResponse<FileDetailDto>>(`${this.baseUrl}/${id}`, payload);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update file');
    }

    // Get file categories
    async getCategories(): Promise<FileCategory[]> {
        const response = await api.get<ApiResponse<FileCategory[]>>(`${this.baseUrl}/categories`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch file categories');
    }
}

export const filesService = new FileService();
export default filesService;