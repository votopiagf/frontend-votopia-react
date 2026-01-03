import React, { useState, useEffect, useMemo } from 'react';
import {
    Users,
    Search,
    UserCheck,
    UsersRound,
    ChevronDown,
    Trash2,
    Edit,
    Download,
    UserPlus
} from 'lucide-react';
import {AppColor} from "@/styles/colors";
import {ActionButton} from "@/components/ui/action-button";

// --- Tipi & Interfacce ---
interface User {
    id: string;
    name: string;
    email: string;
    roles: string;
    lists: string;
    initials: string;
}

// --- Componenti Helper (Definiti fuori per pulizia) ---
interface StatCardProps {
    value: string | number;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>; // <- qui
    bg: string;
    textCol: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon: Icon, bg, textCol }) => (
    <div className={`p-6 rounded-[20px] shadow-lg flex justify-between items-center ${bg}`}>
        <div className="flex flex-col">
            <span
                className={`text-sm font-extrabold mb-2`}
                style={{ color: bg === 'bg-white' ? '#4b5563' : textCol }}
            >
              {label}
            </span>
            <span className="text-5xl font-bold leading-none tracking-tighter" style={{ color: textCol }}>
              {value}
            </span>
        </div>
        <div className={`p-4 rounded-full ${bg === 'bg-white' ? 'bg-gray-100' : 'bg-white/20'}`}>
            <Icon className="w-8 h-8" style={{ color: bg === 'bg-white' ? '#4b5563' : textCol }} />
        </div>
    </div>
);

// --- Componente Principale ---

const UsersScreen: React.FC = () => {
    // --- State ---
    const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Mock Data Loading ---
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Simulazione ritardo network
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockUsers: User[] = [
                    { id: '1', name: 'Mario Rossi', email: 'mario.rossi@example.com', roles: 'Admin, Editor', lists: 'Main List', initials: 'MR' },
                    { id: '2', name: 'Giulia Bianchi', email: 'giulia.b@example.com', roles: 'Viewer', lists: 'Newsletter', initials: 'GB' },
                    { id: '3', name: 'Luca Verdi', email: 'luca.verdi@example.com', roles: 'Moderator', lists: 'Events', initials: 'LV' },
                ];

                setUsers(mockUsers);
                setLoading(false);
            } catch (e) {
                console.error("Errore fetch utenti", e);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // --- Logica Filtri ---
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        return users.filter(u =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    // --- Render ---
    return (
        <div className="flex h-screen w-full bg-[#EFEFEF] overflow-hidden font-sans">


            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {/* Top Bar (Opzionale se vuoi reinserirla come nel codice originale, qui ho tenuto solo il content) */}

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1600px] mx-auto">

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-5 mb-6">
                            <StatCard value="128" label="Utenti totali" icon={Users} bg="bg-white" textCol="#374151" />
                            <StatCard value="10" label="Ruoli disponibili" icon={UserCheck} bg="bg-[#d9f99d]" textCol="#285300" />
                            <StatCard value="32" label="Liste totali" icon={UsersRound} bg="bg-white" textCol="#374151" />
                        </div>

                        {/* Main Content Split */}
                        <div className="flex flex-row items-start gap-6">

                            {/* LEFT COLUMN: Filters + User List */}
                            <div className="flex-[2] flex flex-col gap-4">

                                {/* Filters */}
                                <div className="p-5 bg-white rounded-[20px] shadow-sm flex gap-4 items-center">
                                    <div className="flex-1 h-[45px] bg-[#F8F9FA] rounded-[10px] flex items-center px-4">
                                        <Search size={18} className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            placeholder="Cerca per nome, email ..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
                                        />
                                    </div>
                                    <div className="flex-1 h-[45px] px-4 bg-[#F8F9FA] border border-gray-300 rounded-[10px] flex items-center justify-between cursor-pointer">
                                        <span className="text-gray-800 text-[15px]">Tutti i ruoli</span>
                                        <ChevronDown size={18} className="text-gray-600" />
                                    </div>
                                    <div className="flex-1 h-[45px] px-4 bg-[#F8F9FA] border border-gray-300 rounded-[10px] flex items-center justify-between cursor-pointer">
                                        <span className="text-gray-800 text-[15px]">Tutte le liste</span>
                                        <ChevronDown size={18} className="text-gray-600" />
                                    </div>
                                </div>

                                {/* Users List */}
                                <div className="bg-white rounded-[20px] shadow-sm pb-6 min-h-[400px]">
                                    <div className="p-6 pb-2">
                                        <h3 className="text-xl font-semibold text-gray-800">Utenti registrati</h3>
                                    </div>

                                    {loading ? (
                                        <div className="p-10 text-center text-gray-500">Caricamento...</div>
                                    ) : filteredUsers.length === 0 ? (
                                        <div className="p-10 text-center text-gray-500">Nessun utente trovato</div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {filteredUsers.map((user, idx) => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => setSelectedUserIndex(idx)}
                                                    className={`
                                                        px-6 py-4 border-b border-gray-100 flex items-center cursor-pointer transition-colors hover:bg-gray-50
                                                        ${idx === filteredUsers.length - 1 ? 'border-b-0' : ''}
                                                        ${selectedUserIndex === idx ? 'bg-blue-50/50' : ''}
                                                    `}
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="text-[17px] font-semibold text-gray-900">{user.name}</h4>
                                                        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                                                        <div className="mt-2 flex gap-1">
                                                            <span className="px-2.5 py-1 bg-gray-200 rounded-md text-xs text-gray-700">
                                                                {user.roles}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button className="p-2 bg-[#336900] text-white rounded-[8px] hover:bg-[#285300] transition">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="p-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Profile + Actions */}
                            <div className="flex-[2] flex flex-col gap-6">

                                {/* Profile Card */}
                                <div className="p-7 bg-white rounded-[20px] shadow-sm flex flex-col items-center">
                                    {users.length > 0 ? (
                                        <>
                                            <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-5"
                                                 style={{ backgroundColor: AppColor.secondary }}>
                                                <span className="text-[40px] font-semibold text-[#336900]">
                                                    {selectedUserIndex !== null ? users[selectedUserIndex].initials : users[0].initials}
                                                </span>
                                            </div>

                                            <h2 className="text-2xl font-semibold text-gray-900 text-center">
                                                {selectedUserIndex !== null ? users[selectedUserIndex].name : users[0].name}
                                            </h2>
                                            <p className="text-[15px] text-gray-500 mt-2 text-center">
                                                {selectedUserIndex !== null ? users[selectedUserIndex].roles : users[0].roles}
                                            </p>

                                            <div className="w-full h-px bg-gray-200 my-6"></div>

                                            <div className="w-full mb-4">
                                                <p className="text-[13px] text-gray-500 font-medium mb-1.5">E-mail</p>
                                                <p className="text-sm text-gray-900">
                                                    {selectedUserIndex !== null ? users[selectedUserIndex].email : users[0].email}
                                                </p>
                                            </div>

                                            <div className="w-full h-px bg-gray-200 mb-4"></div>

                                            <div className="w-full mb-6">
                                                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Liste</p>
                                                <p className="text-sm text-gray-900">
                                                    {selectedUserIndex !== null ? users[selectedUserIndex].lists : users[0].lists}
                                                </p>
                                            </div>
                                            <div className="w-full flex flex-col gap-3">
                                                <ActionButton icon={Edit} variant={"secondary"}>
                                                    Modifica utente
                                                </ActionButton>
                                                {/*
                                                <button
                                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[10px] text-[#285300] font-medium mb-3 transition-colors hover:bg-opacity-80"
                                                    style={{ backgroundColor: AppColor.secondary }}
                                                >
                                                    <Edit size={18} />
                                                    Modifica utente
                                                </button> */}

                                                <button className="w-full py-3.5 border border-[#1e3a8a] text-[#1e3a8a] rounded-[10px] font-medium hover:bg-blue-50 transition-colors">
                                                    Reimposta password
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400 py-10">Nessun utente selezionato</div>
                                    )}
                                </div>

                                {/* Actions Buttons Group */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <ActionButton icon={Download}>
                                                Esporta elenco utenti
                                            </ActionButton>
                                        </div>
                                        <div className="flex-1">
                                            <ActionButton variant="secondary" icon={Edit}>
                                                Modifica utenti multipli
                                            </ActionButton>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <ActionButton icon={UserPlus}>
                                                Registra nuovo utente
                                            </ActionButton>
                                        </div>
                                        <div className="flex-1">
                                            <ActionButton icon={UsersRound}>
                                                Registra utenti multipli
                                            </ActionButton>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex-1">
                                            <ActionButton variant="destructive" icon={Trash2}>
                                                Elimina utenti multipli
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>

                            </div> {/* Fine Colonna Destra */}
                        </div> {/* Fine Main Content Split */}

                    </div> {/* <--- QUESTO DIV MANCAVA (Chiusura del max-w container) */}
                </main>
            </div>
        </div>
    );
};

export default UsersScreen;