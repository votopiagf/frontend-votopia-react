// Mocked files service - pattern: export const filesService = { getAll, getById, uploadFileSimulated, update, deleteById, deleteMany, getLists, getUsers, _resetMock }
// Stato in-memory per sviluppo locale.

import type { FileDetail, ListSummary, UserSummary, FileCategory } from "@/test/pages/Files.tsx";

// Mock lists and users (usati per selettori)
let listsDB: ListSummary[] = [
    { id: 1, name: "Main List" },
    { id: 2, name: "Newsletter" },
    { id: 3, name: "Events" },
];

let usersDB: UserSummary[] = [
    { id: 1, name: "Mario Rossi", email: "mario.rossi@example.com" },
    { id: 2, name: "Giulia Bianchi", email: "giulia.b@example.com" },
    { id: 3, name: "Luca Verdi", email: "luca.verdi@example.com" },
];

// files mock
let filesDB: FileDetail[] = [
    {
        id: 1,
        name: "manifesto.pdf",
        list: { id: 1, name: "Main List" },
        user: { id: 1, name: "Mario Rossi", email: "mario.rossi@example.com" },
        fileCategory: "document",
        filePath: "/mocks/manifesto.pdf",
        mimeType: "application/pdf",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        url: "/mocks/manifesto.pdf",
        size: 23456,
    },
    {
        id: 2,
        name: "hero.jpg",
        list: { id: 2, name: "Newsletter" },
        user: { id: 2, name: "Giulia Bianchi", email: "giulia.b@example.com" },
        fileCategory: "image",
        filePath: "/mocks/hero.jpg",
        mimeType: "image/jpeg",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        url: "/mocks/hero.jpg",
        size: 123456,
    },
];

// id counters
let nextFileId = 10;

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const filesService = {
    async getAll(): Promise<FileDetail[]> {
        await delay();
        // copia minima
        return filesDB.map(f => ({ ...f }));
    },

    async getById(id: number): Promise<FileDetail | null> {
        await delay();
        const f = filesDB.find(x => x.id === id);
        return f ? { ...f } : null;
    },

    // Simula il caricamento, crea un FileDetail con url e timestamp
    async uploadFileSimulated(payload: Omit<FileDetail, "id" | "uploadedAt" | "url"> & Partial<Pick<FileDetail, "url">>): Promise<FileDetail> {
        await delay(400);
        const newFile: FileDetail = {
            id: nextFileId++,
            name: payload.name,
            list: payload.list ?? null,
            user: payload.user ?? null,
            fileCategory: payload.fileCategory as FileCategory,
            filePath: payload.filePath,
            mimeType: payload.mimeType,
            uploadedAt: new Date(),
            url: payload.url ?? `/mocks/${payload.name.replace(/\s+/g, "-").toLowerCase()}`,
            size: payload.size,
        };
        filesDB = [newFile, ...filesDB];
        return { ...newFile };
    },

    async update(id: number, payload: Partial<FileDetail>): Promise<FileDetail> {
        await delay(300);
        filesDB = filesDB.map(f => f.id === id ? { ...f, ...payload } as FileDetail : f);
        const f = filesDB.find(x => x.id === id)!;
        return { ...f };
    },

    async deleteById(id: number): Promise<void> {
        await delay(250);
        filesDB = filesDB.filter(f => f.id !== id);
    },

    async deleteMany(ids: number[]): Promise<void> {
        await delay(400);
        const set = new Set(ids);
        filesDB = filesDB.filter(f => !set.has(f.id));
    },

    async getLists(): Promise<ListSummary[]> {
        await delay();
        return listsDB.map(l => ({ ...l }));
    },

    async getUsers(): Promise<UserSummary[]> {
        await delay();
        return usersDB.map(u => ({ ...u }));
    },

    // helper dev/test
    async _resetMock(): Promise<void> {
        await delay(100);
        listsDB = [
            { id: 1, name: "Main List" },
            { id: 2, name: "Newsletter" },
            { id: 3, name: "Events" },
        ];
        usersDB = [
            { id: 1, name: "Mario Rossi", email: "mario.rossi@example.com" },
            { id: 2, name: "Giulia Bianchi", email: "giulia.b@example.com" },
            { id: 3, name: "Luca Verdi", email: "luca.verdi@example.com" },
        ];
        filesDB = [
            {
                id: 1,
                name: "manifesto.pdf",
                list: { id: 1, name: "Main List" },
                user: usersDB[0],
                fileCategory: "document",
                filePath: "/mocks/manifesto.pdf",
                mimeType: "application/pdf",
                uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
                url: "/mocks/manifesto.pdf",
                size: 23456,
            },
        ];
        nextFileId = 10;
    }
};

export default filesService;