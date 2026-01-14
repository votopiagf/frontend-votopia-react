// Mocked lists service - pattern: export const listsService = { getAll, getById, create, update, deleteById, getSchools, uploadFile, _resetMock }
// Stato in-memory per sviluppo locale.

import type { ListDetail, SchoolSummary, FileSummary } from "@/test/pages/Lists.tsx";

// schools mock
let schoolsDB: SchoolSummary[] = [
    { id: 1, name: "Liceo Scientifico A" },
    { id: 2, name: "Istituto Tecnico B" },
    { id: 3, name: "Scuola Media C" },
];

// files mock (semplice)
let filesDB: FileSummary[] = [
    { id: 1, name: "logo-main.png", url: "/mocks/logo-main.png", size: 12345 },
    { id: 2, name: "hero.jpg", url: "/mocks/hero.jpg", size: 45678 },
];

// lists mock
let listsDB: ListDetail[] = [
    {
        id: 1,
        name: "Main List",
        description: "Lista principale del progetto",
        school: { id: 1, name: "Liceo Scientifico A" },
        slogan: "Insieme per imparare",
        colorPrimary: "#0ea5a4",
        colorSecondary: "#ffffff",
        file: filesDB[0],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
    {
        id: 2,
        name: "Newsletter",
        description: "Lista per comunicazioni",
        school: { id: 2, name: "Istituto Tecnico B" },
        slogan: "Notizie e aggiornamenti",
        colorPrimary: "#7c3aed",
        colorSecondary: "#ffffff",
        file: filesDB[1],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
];

// id counters
let nextListId = 10;
let nextFileId = 100;

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const listsService = {
    async getAll(): Promise<ListDetail[]> {
        await delay();
        return listsDB.map(l => ({ ...l, file: l.file ? { ...l.file } : undefined }));
    },

    async getById(id: number): Promise<ListDetail | null> {
        await delay();
        const l = listsDB.find(x => x.id === id);
        return l ? { ...l, file: l.file ? { ...l.file } : undefined } : null;
    },

    async getSchools(): Promise<SchoolSummary[]> {
        await delay();
        return schoolsDB.map(s => ({ ...s }));
    },

    async create(payload: Omit<ListDetail, "id" | "createdAt">): Promise<ListDetail> {
        await delay(350);
        const newItem: ListDetail = {
            id: nextListId++,
            ...payload,
            createdAt: new Date(),
        };
        listsDB = [newItem, ...listsDB];
        return { ...newItem, file: newItem.file ? { ...newItem.file } : undefined };
    },

    async update(id: number, payload: Partial<Omit<ListDetail, "createdAt">>): Promise<ListDetail> {
        await delay(300);
        listsDB = listsDB.map(l => l.id === id ? { ...l, ...payload } as ListDetail : l);
        const r = listsDB.find(x => x.id === id)!;
        return { ...r, file: r.file ? { ...r.file } : undefined };
    },

    async deleteById(id: number): Promise<void> {
        await delay(250);
        listsDB = listsDB.filter(l => l.id !== id);
    },

    async uploadFile(listId: number, file: { name: string; size?: number }): Promise<FileSummary> {
        await delay(400);
        const f: FileSummary = { id: nextFileId++, name: file.name, url: `/mocks/${file.name}`, size: file.size || 0 };
        filesDB.push(f);
        listsDB = listsDB.map(l => l.id === listId ? { ...l, file: f } : l);
        return { ...f };
    },

    // helper per sviluppo/test
    async _resetMock(): Promise<void> {
        await delay(100);
        schoolsDB = [
            { id: 1, name: "Liceo Scientifico A" },
            { id: 2, name: "Istituto Tecnico B" },
            { id: 3, name: "Scuola Media C" },
        ];
        filesDB = [
            { id: 1, name: "logo-main.png", url: "/mocks/logo-main.png", size: 12345 },
            { id: 2, name: "hero.jpg", url: "/mocks/hero.jpg", size: 45678 },
        ];
        listsDB = [
            {
                id: 1,
                name: "Main List",
                description: "Lista principale del progetto",
                school: { id: 1, name: "Liceo Scientifico A" },
                slogan: "Insieme per imparare",
                colorPrimary: "#0ea5a4",
                colorSecondary: "#ffffff",
                file: filesDB[0],
                createdAt: new Date(),
            },
        ];
        nextListId = 10;
        nextFileId = 100;
    }
};

export default listsService;