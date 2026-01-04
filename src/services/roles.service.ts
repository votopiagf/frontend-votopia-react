// Mocked role service - pattern: export const roleService = { getAll, getById, create, update, deleteById, addPermission, removePermission, getLists }
// Stato in-memory per sviluppo locale.

import type { RoleDetail, ListSummary, PermissionSummary } from "@/pages/Roles";

// Liste esempio (per ruoli di lista)
let listsDB: ListSummary[] = [
    { id: 1, name: "Main List" },
    { id: 2, name: "Newsletter" },
    { id: 3, name: "Events" },
    { id: 4, name: "Marketing" },
];

// utilità delay simulato
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

// Ruoli iniziali mockati (organizzazione e lista)
let rolesDB: RoleDetail[] = [
    {
        id: 1,
        list: null, // ruolo di organizzazione
        name: "Super Admin",
        color: "#1e293b",
        level: 999,
        permissions: [
            { id: 1, name: "manage_all" },
            { id: 2, name: "manage_users" },
            { id: 3, name: "manage_roles" },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
    {
        id: 2,
        list: null,
        name: "Admin",
        color: "#0ea5a4",
        level: 900,
        permissions: [
            { id: 4, name: "manage_users" },
            { id: 5, name: "view_reports" },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    },
    {
        id: 3,
        list: { id: 1, name: "Main List" },
        name: "Main Moderator",
        color: "#065f46",
        level: 200,
        permissions: [
            { id: 6, name: "moderate_posts" },
            { id: 7, name: "pin_posts" },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
    {
        id: 4,
        list: { id: 2, name: "Newsletter" },
        name: "Newsletter Editor",
        color: "#7c3aed",
        level: 150,
        permissions: [
            { id: 8, name: "edit_newsletter" },
            { id: 9, name: "send_newsletter" },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
];

// contatori per id
let nextRoleId = 10;
let nextPermId = 100;

// Export del servizio mockato
export const roleService = {
    async getAll(): Promise<RoleDetail[]> {
        await delay();
        // ritorna copia per evitare mutazioni esterne
        return rolesDB.map((r) => ({ ...r, permissions: r.permissions.map((p) => ({ ...p })) }));
    },

    async getById(id: number): Promise<RoleDetail | null> {
        await delay();
        const r = rolesDB.find((x) => x.id === id);
        return r ? { ...r, permissions: r.permissions.map((p) => ({ ...p })) } : null;
    },

    async getLists(): Promise<ListSummary[]> {
        await delay();
        return listsDB.map((l) => ({ ...l }));
    },

    async create(payload: Omit<RoleDetail, "id" | "createdAt">): Promise<RoleDetail> {
        await delay(350);
        const newRole: RoleDetail = {
            id: nextRoleId++,
            ...payload,
            createdAt: new Date(),
        };
        rolesDB = [newRole, ...rolesDB];
        return { ...newRole, permissions: newRole.permissions.map((p) => ({ ...p })) };
    },

    async update(id: number, payload: Partial<Omit<RoleDetail, "createdAt">>): Promise<RoleDetail> {
        await delay(300);
        rolesDB = rolesDB.map((r) => (r.id === id ? { ...r, ...payload } : r));
        const r = rolesDB.find((x) => x.id === id)!;
        return { ...r, permissions: r.permissions.map((p) => ({ ...p })) };
    },

    async deleteById(id: number): Promise<void> {
        await delay(250);
        rolesDB = rolesDB.filter((r) => r.id !== id);
    },

    async addPermission(roleId: number, perm: PermissionSummary): Promise<RoleDetail> {
        await delay(250);
        const newPerm = { id: nextPermId++, ...perm };
        rolesDB = rolesDB.map((r) => (r.id === roleId ? { ...r, permissions: [...r.permissions, newPerm] } : r));
        const r = rolesDB.find((x) => x.id === roleId)!;
        return { ...r, permissions: r.permissions.map((p) => ({ ...p })) };
    },

    async removePermission(roleId: number, permId: number): Promise<RoleDetail> {
        await delay(250);
        rolesDB = rolesDB.map((r) => (r.id === roleId ? { ...r, permissions: r.permissions.filter((p) => p.id !== permId) } : r));
        const r = rolesDB.find((x) => x.id === roleId)!;
        return { ...r, permissions: r.permissions.map((p) => ({ ...p })) };
    },

    // helper per testing/dev: reset dati al mock iniziale
    async _resetMock(): Promise<void> {
        await delay(100);
        listsDB = [
            { id: 1, name: "Main List" },
            { id: 2, name: "Newsletter" },
            { id: 3, name: "Events" },
            { id: 4, name: "Marketing" },
        ];
        rolesDB = [
            {
                id: 1,
                list: null,
                name: "Super Admin",
                color: "#1e293b",
                level: 999,
                permissions: [
                    { id: 1, name: "manage_all" },
                    { id: 2, name: "manage_users" },
                    { id: 3, name: "manage_roles" },
                ],
                createdAt: new Date(),
            },
        ];
        nextRoleId = 10;
        nextPermId = 100;
    },
};

export default roleService;