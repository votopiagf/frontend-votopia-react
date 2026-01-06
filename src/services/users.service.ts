import api from "@/services/api";

type AnyObj = Record<string, unknown>;

function unwrapResponse<T = unknown>(res: any): T {
    // supporta sia shape { data: { data: T } } (ApiResponse) sia { data: T } sia T
    if (!res) return null as unknown as T;
    if (res.data && res.data.data !== undefined) return res.data.data as T;
    if (res.data !== undefined) return res.data as T;
    return res as T;
}

function normalizeId<T extends AnyObj>(item: T) {
    if (item == null) return item;
    if (typeof item.id !== 'string') {
        return { ...item, id: String(item.id) } as T;
    }
    return item;
}

class UsersService {
    async getAll(): Promise<any[]> {
        const res = await api.get('api/users/all/');
        const data = unwrapResponse<any[]>(res) || [];
        return Array.isArray(data) ? data.map(normalizeId) : [];
    }

    async getById(id: string | number): Promise<any | null> {
        const res = await api.get(`api/users/${encodeURIComponent(String(id))}/`);
        const data = unwrapResponse<any>(res);
        return data ? normalizeId(data) : null;
    }

    async create(payload: AnyObj): Promise<any> {
        const res = await api.post('api/users/', payload);
        const data = unwrapResponse<any>(res);
        return normalizeId(data);
    }

    async update(id: string | number, payload: AnyObj): Promise<any> {
        const res = await api.put(`api/users/${encodeURIComponent(String(id))}/`, payload);
        const data = unwrapResponse<any>(res);
        return normalizeId(data || { id });
    }

    async deleteById(id: string | number): Promise<void> {
        await api.delete(`api/users/${encodeURIComponent(String(id))}/`);
    }

    async deleteMany(ids: (string | number)[]): Promise<void> {
        // endpoint comune per delete many; fallback: invia singole delete se non disponibile
        try {
            await api.post('api/users/delete-many/', { ids });
        } catch (e) {
            // fallback: delete singole
            await Promise.all(ids.map(id => api.delete(`api/users/${encodeURIComponent(String(id))}/`)));
        }
    }

    // opzionali per la UI (manteniamo wrapper semplice)
    async getRoles(): Promise<any[]> {
        const res = await api.get('api/roles/');
        return unwrapResponse<any[]>(res) || [];
    }

    async getLists(): Promise<any[]> {
        const res = await api.get('api/lists/');
        return unwrapResponse<any[]>(res) || [];
    }
}

export default new UsersService();