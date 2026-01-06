// Mocked user service - pattern: export const userService = { getAll, deleteById, deleteMany, create, update }
// Questo file è intenzionalmente semplice e mantiene lo stato in memoria per scopi di sviluppo/local.

type UserLocal = {
    id: string;
    name: string;
    email: string;
    roles: string;
    lists: string;
    initials: string;
};

// In-memory store (simula DB)
let usersDB: UserLocal[] = [
    { id: '1', name: 'Mario Rossi', email: 'mario.rossi@example.com', roles: 'Admin, Editor', lists: 'Main List', initials: 'MR' },
    { id: '2', name: 'Giulia Bianchi', email: 'giulia.b@example.com', roles: 'Viewer', lists: 'Newsletter', initials: 'GB' },
    { id: '3', name: 'Luca Verdi', email: 'luca.verdi@example.com', roles: 'Moderator', lists: 'Events', initials: 'LV' },
];

// utilità per delay simulato
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
    async getAll(): Promise<UserLocal[]> {
        await delay(300);
        // restituisci copia per evitare leak di riferimento
        return usersDB.map(u => ({ ...u }));
    },

    async deleteById(id: string): Promise<void> {
        await delay(300);
        usersDB = usersDB.filter(u => u.id !== id);
    },

    async deleteMany(ids: string[]): Promise<void> {
        await delay(400);
        const set = new Set(ids);
        usersDB = usersDB.filter(u => !set.has(u.id));
    },

    async create(payload: Omit<UserLocal, 'id'>): Promise<UserLocal> {
        await delay(300);
        const newUser: UserLocal = {
            id: (Date.now() + Math.floor(Math.random() * 1000)).toString(),
            ...payload
        };
        usersDB = [newUser, ...usersDB];
        return { ...newUser };
    },

    async update(id: string, payload: Partial<UserLocal>): Promise<UserLocal> {
        await delay(300);
        usersDB = usersDB.map(u => u.id === id ? { ...u, ...payload } : u);
        const user = usersDB.find(u => u.id === id)!;
        return { ...user };
    }
};

export default userService;