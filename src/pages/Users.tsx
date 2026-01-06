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
import { userService } from "@/services/users.service"; // service mockato (pattern userService)

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

// --- Confirm Modal (stile coerente con UI esistente) ---
interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                       open,
                                                       title = "Conferma",
                                                       message,
                                                       onConfirm,
                                                       onCancel,
                                                       confirmLabel = "Conferma",
                                                       cancelLabel = "Annulla",
                                                       loading = false
                                                   }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[480px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded-[8px] bg-gray-100 text-gray-700"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className="px-4 py-2 rounded-[8px] bg-red-600 text-white"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Eliminando...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Edit Single User Modal ---
interface EditUserModalProps {
    open: boolean;
    user: User | null;
    onCancel: () => void;
    onSave: (u: User) => void;
    loading?: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ open, user, onCancel, onSave, loading = false }) => {
    // Use user prop directly as initial state, reset only when user.id changes
    const [form, setForm] = useState<User | null>(user);

    // Sync form with user when user changes (different user selected)
    if (user && (!form || form.id !== user.id)) {
        setForm({ ...user });
    }

    if (!open || !form) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[520px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifica utente</h3>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-600">Nome</label>
                        <input
                            className="w-full mt-1 p-2 border rounded text-sm"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            className="w-full mt-1 p-2 border rounded text-sm"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Ruoli</label>
                        <input
                            className="w-full mt-1 p-2 border rounded text-sm"
                            value={form.roles}
                            onChange={(e) => setForm({ ...form, roles: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Liste</label>
                        <input
                            className="w-full mt-1 p-2 border rounded text-sm"
                            value={form.lists}
                            onChange={(e) => setForm({ ...form, lists: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={onCancel} disabled={loading}>Annulla</button>
                    <button
                        className="px-4 py-2 rounded-[8px] bg-blue-600 text-white"
                        onClick={() => { onSave(form); }}
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salva'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Register Single User Modal ---
interface RegisterUserModalProps {
    open: boolean;
    onCancel: () => void;
    onCreate: (u: Omit<User, 'id'>) => void;
    loading?: boolean;
}

const RegisterUserModal: React.FC<RegisterUserModalProps> = ({ open, onCancel, onCreate, loading = false }) => {
    const initialForm = { name: '', email: '', roles: '', lists: '', initials: '' };
    const [form, setForm] = useState<Omit<User, 'id'>>(initialForm);

    const handleCancel = () => {
        setForm(initialForm);
        onCancel();
    };

    const handleCreate = () => {
        onCreate(form);
        setForm(initialForm);
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[520px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Registra nuovo utente</h3>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-600">Nome</label>
                        <input
                            className="w-full mt-1 p-2 border rounded text-sm"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            className="w-full mt-1 p-2 border rounded text-sm"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-sm text-gray-600">Ruoli</label>
                            <input
                                className="w-full mt-1 p-2 border rounded text-sm"
                                value={form.roles}
                                onChange={(e) => setForm({ ...form, roles: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-gray-600">Liste</label>
                            <input
                                className="w-full mt-1 p-2 border rounded text-sm"
                                value={form.lists}
                                onChange={(e) => setForm({ ...form, lists: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Iniziali</label>
                        <input
                            className="w-full mt-1 p-2 border rounded text-sm"
                            value={form.initials}
                            onChange={(e) => setForm({ ...form, initials: e.target.value })}
                            placeholder="es. MR"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={handleCancel} disabled={loading}>Annulla</button>
                    <button
                        className="px-4 py-2 rounded-[8px] bg-green-600 text-white"
                        onClick={handleCreate}
                        disabled={loading || !form.name || !form.email}
                    >
                        {loading ? 'Salvando...' : 'Registra'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Bulk Register Modal ---
interface BulkRegisterModalProps {
    open: boolean;
    onCancel: () => void;
    onCreateMany: (payloads: Omit<User, 'id'>[]) => void;
    loading?: boolean;
}

const BulkRegisterModal: React.FC<BulkRegisterModalProps> = ({ open, onCancel, onCreateMany, loading = false }) => {
    const emptyRow = { name: '', email: '', roles: '', lists: '', initials: '' };
    const [rows, setRows] = useState<Omit<User, 'id'>[]>([ { ...emptyRow } ]);

    const handleCancel = () => {
        setRows([ { ...emptyRow } ]);
        onCancel();
    };

    const handleCreateMany = () => {
        const validRows = rows.filter(r => r.name && r.email);
        onCreateMany(validRows);
        setRows([ { ...emptyRow } ]);
    };

    const updateRow = (idx: number, key: keyof Omit<User, 'id'>, value: string) => {
        setRows(prev => {
            const clone = [...prev];
            clone[idx] = { ...clone[idx], [key]: value };
            return clone;
        });
    };

    const addRow = () => setRows(prev => [...prev, { ...emptyRow }]);
    const removeRow = (idx: number) => setRows(prev => prev.filter((_, i) => i !== idx));

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[720px] max-h-[80vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Registra utenti multipli</h3>
                <p className="text-sm text-gray-600 mb-4">Aggiungi una riga per ogni utente. Al termine premi Registra.</p>

                <div className="space-y-3">
                    {rows.map((r, idx) => (
                        <div key={idx} className="p-3 border rounded grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-4">
                                <input
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Nome"
                                    value={r.name}
                                    onChange={(e) => updateRow(idx, 'name', e.target.value)}
                                />
                            </div>
                            <div className="col-span-4">
                                <input
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Email"
                                    value={r.email}
                                    onChange={(e) => updateRow(idx, 'email', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Ruoli"
                                    value={r.roles}
                                    onChange={(e) => updateRow(idx, 'roles', e.target.value)}
                                />
                            </div>
                            <div className="col-span-1">
                                <input
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Init"
                                    value={r.initials}
                                    onChange={(e) => updateRow(idx, 'initials', e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 text-right">
                                <button className="px-2 py-1 text-sm text-red-600" onClick={() => removeRow(idx)} disabled={rows.length === 1}>Rimuovi</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <button className="px-3 py-1 border rounded text-sm" onClick={addRow}>Aggiungi riga</button>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={handleCancel} disabled={loading}>Annulla</button>
                        <button
                            className="px-4 py-2 rounded-[8px] bg-green-600 text-white"
                            onClick={handleCreateMany}
                            disabled={loading || rows.every(r => !r.name || !r.email)}
                        >
                            {loading ? 'Registrando...' : `Registra (${rows.filter(r => r.name && r.email).length})`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Bulk Select + Delete Modal ---
interface BulkDeleteModalProps {
    open: boolean;
    users: User[];
    onCancel: () => void;
    onConfirm: (ids: string[]) => void;
    loading?: boolean;
}

const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({ open, users, onCancel, onConfirm, loading = false }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleCancel = () => {
        setSelectedIds(new Set());
        onCancel();
    };

    const handleConfirm = () => {
        onConfirm(Array.from(selectedIds));
        setSelectedIds(new Set());
    };

    const toggle = (id: string) => {
        setSelectedIds(prev => {
            const clone = new Set(prev);
            if (clone.has(id)) {
                clone.delete(id);
            } else {
                clone.add(id);
            }
            return clone;
        });
    };

    const selectAll = () => setSelectedIds(new Set(users.map(u => u.id)));
    const clearAll = () => setSelectedIds(new Set());

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[720px] max-h-[80vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Elimina utenti multipli</h3>
                <p className="text-sm text-gray-600 mb-4">Seleziona gli utenti che desideri eliminare.</p>

                <div className="flex gap-3 mb-3">
                    <button className="px-3 py-1 border rounded text-sm" onClick={selectAll}>Seleziona tutti</button>
                    <button className="px-3 py-1 border rounded text-sm" onClick={clearAll}>Deseleziona</button>
                </div>

                <div className="space-y-2">
                    {users.map(u => (
                        <label key={u.id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                                <div className="font-medium text-gray-900">{u.name}</div>
                                <div className="text-xs text-gray-500">{u.email} • {u.roles}</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedIds.has(u.id)}
                                onChange={() => toggle(u.id)}
                            />
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={handleCancel} disabled={loading}>Annulla</button>
                    <button
                        className="px-4 py-2 rounded-[8px] bg-red-600 text-white"
                        onClick={handleConfirm}
                        disabled={loading || selectedIds.size === 0}
                    >
                        {loading ? 'Eliminando...' : `Elimina selezionati (${selectedIds.size})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Bulk Edit Modal ---
interface BulkEditModalProps {
    open: boolean;
    users: User[];
    onCancel: () => void;
    onConfirm: (ids: string[], payload: Partial<User>) => void;
    loading?: boolean;
}

const BulkEditModal: React.FC<BulkEditModalProps> = ({ open, users, onCancel, onConfirm, loading = false }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [roles, setRoles] = useState('');
    const [lists, setLists] = useState('');

    const handleCancel = () => {
        setSelectedIds(new Set());
        setRoles('');
        setLists('');
        onCancel();
    };

    const handleConfirm = () => {
        onConfirm(Array.from(selectedIds), { roles, lists });
        setSelectedIds(new Set());
        setRoles('');
        setLists('');
    };

    const toggle = (id: string) => {
        setSelectedIds(prev => {
            const clone = new Set(prev);
            if (clone.has(id)) {
                clone.delete(id);
            } else {
                clone.add(id);
            }
            return clone;
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[720px] max-h-[80vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Modifica utenti multipli</h3>
                <p className="text-sm text-gray-600 mb-4">Seleziona gli utenti e applica le modifiche desiderate.</p>

                <div className="mb-4">
                    <label className="text-sm text-gray-600">Ruoli (sovrascrive)</label>
                    <input className="w-full mt-1 p-2 border rounded text-sm" value={roles} onChange={(e) => setRoles(e.target.value)} />
                </div>

                <div className="mb-4">
                    <label className="text-sm text-gray-600">Liste (sovrascrive)</label>
                    <input className="w-full mt-1 p-2 border rounded text-sm" value={lists} onChange={(e) => setLists(e.target.value)} />
                </div>

                <div className="space-y-2 mb-4">
                    {users.map(u => (
                        <label key={u.id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                                <div className="font-medium text-gray-900">{u.name}</div>
                                <div className="text-xs text-gray-500">{u.email} • {u.roles}</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedIds.has(u.id)}
                                onChange={() => toggle(u.id)}
                            />
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={handleCancel} disabled={loading}>Annulla</button>
                    <button
                        className="px-4 py-2 rounded-[8px] bg-blue-600 text-white"
                        onClick={handleConfirm}
                        disabled={loading || selectedIds.size === 0}
                    >
                        {loading ? 'Applicando...' : `Applica a (${selectedIds.size})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Componente Principale ---

const UsersScreen: React.FC = () => {
    // --- State ---
    const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // modals / azioni
    const [showSingleConfirm, setShowSingleConfirm] = useState(false);
    const [userToAct, setUserToAct] = useState<User | null>(null);
    const [showBulkSelector, setShowBulkSelector] = useState(false); // per selezione delete
    const [showBulkEdit, setShowBulkEdit] = useState(false); // per edit multiplo
    const [showEditUser, setShowEditUser] = useState(false); // edit singolo modal
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // nuovi modals per registrazione
    const [showRegisterSingle, setShowRegisterSingle] = useState(false);
    const [showBulkRegister, setShowBulkRegister] = useState(false);

    // --- Mock Data Loading via service ---
    useEffect(() => {
        let cancelled = false;
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // usa il service mockato
                const data = await userService.getAll();
                if (!cancelled) setUsers(data);
            } catch (e) {
                console.error("Errore fetch utenti", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchUsers();
        return () => { cancelled = true; };
    }, []);

    // --- Logica Filtri ---
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        return users.filter(u =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    // --- Azioni: apri modal singolo delete ---
    const openDeleteSingle = (user: User) => {
        setUserToAct(user);
        setShowSingleConfirm(true);
    };

    const confirmDeleteSingle = async () => {
        if (!userToAct) return;
        setActionLoading(true);
        try {
            await userService.deleteById(userToAct.id);
            setUsers(prev => {
                const next = prev.filter(u => u.id !== userToAct.id);
                // aggiorna selected index se necessario
                if (selectedUserIndex !== null) {
                    const removedIdx = prev.findIndex(p => p.id === userToAct.id);
                    if (removedIdx >= 0) {
                        if (removedIdx === selectedUserIndex) {
                            setSelectedUserIndex(null);
                        } else if (removedIdx < selectedUserIndex) {
                            setSelectedUserIndex(i => i !== null ? i - 1 : i);
                        }
                    }
                }
                return next;
            });
        } catch (e) {
            console.error("Errore eliminazione singola", e);
        } finally {
            setActionLoading(false);
            setShowSingleConfirm(false);
            setUserToAct(null);
        }
    };

    // --- Azioni: bulk delete via modal con selezione ---
    const openBulkDeleteSelector = () => setShowBulkSelector(true);

    const confirmBulkDelete = async (ids: string[]) => {
        if (ids.length === 0) return;
        setActionLoading(true);
        try {
            await userService.deleteMany(ids);
            setUsers(prev => prev.filter(u => !ids.includes(u.id)));
            setSelectedUserIndex(null);
        } catch (e) {
            console.error("Errore bulk delete", e);
        } finally {
            setActionLoading(false);
            setShowBulkSelector(false);
        }
    };

    // --- Azioni: bulk edit via modal ---
    const openBulkEdit = () => setShowBulkEdit(true);

    const confirmBulkEdit = async (ids: string[], payload: Partial<User>) => {
        if (ids.length === 0) return;
        setActionLoading(true);
        try {
            // applica update su ogni id
            await Promise.all(ids.map(id => userService.update(id, payload)));
            setUsers(prev => prev.map(u => ids.includes(u.id) ? { ...u, ...payload } : u));
        } catch (e) {
            console.error("Errore bulk edit", e);
        } finally {
            setActionLoading(false);
            setShowBulkEdit(false);
        }
    };

    // --- Azioni: edit singolo ---
    const openEditUser = (user: User) => {
        setUserToAct(user);
        setShowEditUser(true);
    };

    const saveEditUser = async (updated: User) => {
        setActionLoading(true);
        try {
            const res = await userService.update(updated.id, {
                name: updated.name,
                email: updated.email,
                roles: updated.roles,
                lists: updated.lists
            });
            setUsers(prev => prev.map(u => u.id === res.id ? { ...u, ...res } : u));
        } catch (e) {
            console.error("Errore salvataggio utente", e);
        } finally {
            setActionLoading(false);
            setShowEditUser(false);
            setUserToAct(null);
        }
    };

    // --- Reimposta password (simulata) ---
    const openResetPassword = () => {
        setShowResetConfirm(true);
    };

    const confirmResetPassword = async () => {
        if (selectedUserIndex === null) {
            setShowResetConfirm(false);
            return;
        }
        const user = users[selectedUserIndex];
        if (!user) {
            setShowResetConfirm(false);
            return;
        }
        setActionLoading(true);
        try {
            // simulazione: salviamo un flag o timestamp
            await userService.update(user.id, { /* aggiunge campo simulato */ lists: user.lists });
            // non cambiamo dati sensibili in questo mock, ma qui metteresti la chiamata reale
            console.log(`Password resettata per ${user.email} (simulazione)`);
        } catch (e) {
            console.error("Errore reset password", e);
        } finally {
            setActionLoading(false);
            setShowResetConfirm(false);
        }
    };

    // --- Registrazione: singola e multipla ---
    const openRegisterSingle = () => setShowRegisterSingle(true);
    const openBulkRegisterModal = () => setShowBulkRegister(true);

    const confirmRegisterSingle = async (payload: Omit<User, 'id'>) => {
        setActionLoading(true);
        try {
            const created = await userService.create(payload);
            setUsers(prev => [created, ...prev]);
        } catch (e) {
            console.error("Errore registrazione utente", e);
        } finally {
            setActionLoading(false);
            setShowRegisterSingle(false);
        }
    };

    const confirmRegisterMany = async (payloads: Omit<User, 'id'>[]) => {
        if (payloads.length === 0) return;
        setActionLoading(true);
        try {
            const created = await Promise.all(payloads.map(p => userService.create(p)));
            setUsers(prev => [...created, ...prev]);
        } catch (e) {
            console.error("Errore registrazione multipla", e);
        } finally {
            setActionLoading(false);
            setShowBulkRegister(false);
        }
    };

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
                                                        <button
                                                            className="p-2 bg-[#336900] text-white rounded-[8px] hover:bg-[#285300] transition"
                                                            onClick={(e) => { e.stopPropagation(); openEditUser(user); }}
                                                            title="Modifica"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            className="p-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition"
                                                            onClick={(e) => { e.stopPropagation(); openDeleteSingle(user); }}
                                                            title="Elimina"
                                                        >
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
                                                <ActionButton icon={Edit} variant={"secondary"} onClick={() => {
                                                    if (selectedUserIndex !== null) openEditUser(users[selectedUserIndex]);
                                                }}>
                                                    Modifica utente
                                                </ActionButton>

                                                <button
                                                    className="w-full py-3.5 border border-[#1e3a8a] text-[#1e3a8a] rounded-[10px] font-medium hover:bg-blue-50 transition-colors"
                                                    onClick={openResetPassword}
                                                >
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
                                            <ActionButton variant="secondary" icon={Edit} onClick={openBulkEdit}>
                                                Modifica utenti multipli
                                            </ActionButton>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <ActionButton icon={UserPlus} onClick={openRegisterSingle}>
                                                Registra nuovo utente
                                            </ActionButton>
                                        </div>
                                        <div className="flex-1">
                                            <ActionButton icon={UsersRound} onClick={openBulkRegisterModal}>
                                                Registra utenti multipli
                                            </ActionButton>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex-1">
                                            <ActionButton
                                                variant="destructive"
                                                icon={Trash2}
                                                onClick={openBulkDeleteSelector}
                                            >
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

            {/* Modals */}
            <ConfirmModal
                open={showSingleConfirm}
                title="Elimina utente"
                message={`Sei sicuro di voler eliminare l'utente "${userToAct?.name}"? Questa azione non è reversibile.`}
                onCancel={() => { setShowSingleConfirm(false); setUserToAct(null); }}
                onConfirm={confirmDeleteSingle}
                confirmLabel="Elimina"
                cancelLabel="Annulla"
                loading={actionLoading}
            />

            <BulkDeleteModal
                open={showBulkSelector}
                users={users}
                onCancel={() => setShowBulkSelector(false)}
                onConfirm={confirmBulkDelete}
                loading={actionLoading}
            />

            <BulkEditModal
                open={showBulkEdit}
                users={users}
                onCancel={() => setShowBulkEdit(false)}
                onConfirm={confirmBulkEdit}
                loading={actionLoading}
            />

            <EditUserModal
                open={showEditUser}
                user={userToAct}
                onCancel={() => { setShowEditUser(false); setUserToAct(null); }}
                onSave={saveEditUser}
                loading={actionLoading}
            />

            <ConfirmModal
                open={showResetConfirm}
                title="Reimposta password"
                message={`Sei sicuro di voler reimpostare la password per l'utente selezionato? Verrà inviata una notifica (simulazione).`}
                onCancel={() => setShowResetConfirm(false)}
                onConfirm={confirmResetPassword}
                confirmLabel="Reimposta"
                cancelLabel="Annulla"
                loading={actionLoading}
            />

            <RegisterUserModal
                open={showRegisterSingle}
                onCancel={() => setShowRegisterSingle(false)}
                onCreate={confirmRegisterSingle}
                loading={actionLoading}
            />

            <BulkRegisterModal
                open={showBulkRegister}
                onCancel={() => setShowBulkRegister(false)}
                onCreateMany={confirmRegisterMany}
                loading={actionLoading}
            />
        </div>
    );
};

export default UsersScreen;