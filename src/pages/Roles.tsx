import React, { useEffect, useMemo, useState } from "react";
import {
    Users,
    Search,
    UserCheck,
    UsersRound,
    Trash2,
    Edit,
    Plus,
    ShieldOff,
} from "lucide-react";
import { AppColor } from "@/styles/colors";
import { ActionButton } from "@/components/ui/action-button";
import { roleService } from "@/services/roles.service";

// Tipi (basati sulla tua definizione)
export interface ListSummary {
    id: number;
    name: string;
}

export interface PermissionSummary {
    id: number;
    name: string;
    description?: string;
}

export interface RoleDetail {
    id: number;
    list: ListSummary | null; // null => ruolo di organizzazione
    name: string;
    color: string;
    level: number;
    permissions: PermissionSummary[];
    createdAt: Date;
}

// --- Small helper components (stile coerente con Users.tsx) ---
interface StatCardProps {
    value: string | number;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    bg: string;
    textCol: string;
}
const StatCard: React.FC<StatCardProps> = ({ value, label, icon: Icon, bg, textCol }) => (
    <div className={`p-6 rounded-[20px] shadow-lg flex justify-between items-center ${bg}`}>
        <div className="flex flex-col">
      <span className="text-sm font-extrabold mb-2" style={{ color: bg === "bg-white" ? "#4b5563" : textCol }}>
        {label}
      </span>
            <span className="text-5xl font-bold leading-none tracking-tighter" style={{ color: textCol }}>
        {value}
      </span>
        </div>
        <div className={`p-4 rounded-full ${bg === "bg-white" ? "bg-gray-100" : "bg-white/20"}`}>
            <Icon className="w-8 h-8" style={{ color: bg === "bg-white" ? "#4b5563" : textCol }} />
        </div>
    </div>
);

// --- Confirm Modal (riutilizzabile) ---
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
                                                       loading = false,
                                                   }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[520px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100 text-gray-700" onClick={onCancel} disabled={loading}>
                        {cancelLabel}
                    </button>
                    <button className="px-4 py-2 rounded-[8px] bg-red-600 text-white" onClick={onConfirm} disabled={loading}>
                        {loading ? "Elaborazione..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Role form modal (add/edit) ---
interface RoleFormModalProps {
    open: boolean;
    role: RoleDetail | null; // null => create
    lists: ListSummary[];
    onCancel: () => void;
    onSave: (payload: Omit<RoleDetail, "id" | "createdAt"> & Partial<Pick<RoleDetail, "id">>) => void;
    loading?: boolean;
}
const RoleFormModal: React.FC<RoleFormModalProps> = ({ open, role, lists, onCancel, onSave, loading = false }) => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#336900");
    const [level, setLevel] = useState(0);
    const [listId, setListId] = useState<number | "org">("org");

    useEffect(() => {
        if (!open) return;
        if (role) {
            setName(role.name);
            setColor(role.color);
            setLevel(role.level);
            setListId(role.list ? role.list.id : "org");
        } else {
            setName("");
            setColor("#336900");
            setLevel(0);
            setListId("org");
        }
    }, [open, role]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[600px] max-h-[90vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{role ? "Modifica ruolo" : "Nuovo ruolo"}</h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-600">Nome</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Colore (hex)</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={color} onChange={(e) => setColor(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Livello</label>
                        <input type="number" className="w-full mt-1 p-2 border rounded text-sm" value={level} onChange={(e) => setLevel(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Tipologia</label>
                        <select className="w-full mt-1 p-2 border rounded text-sm" value={listId} onChange={(e) => setListId(e.target.value === "org" ? "org" : Number(e.target.value))}>
                            <option value="org">Ruolo di organizzazione</option>
                            <optgroup label="Ruoli delle liste">
                                {lists.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.name}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={onCancel} disabled={loading}>
                        Annulla
                    </button>
                    <button
                        className="px-4 py-2 rounded-[8px] bg-blue-600 text-white"
                        onClick={() =>
                            onSave({
                                id: role?.id,
                                name,
                                color,
                                level,
                                list: listId === "org" ? null : lists.find((l) => l.id === listId) || null,
                                permissions: role?.permissions || [],
                            })
                        }
                        disabled={loading || !name}
                    >
                        {loading ? "Salvando..." : role ? "Salva" : "Crea"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Permissions Modal ---
interface PermissionsModalProps {
    open: boolean;
    role: RoleDetail | null;
    onCancel: () => void;
    onAdd: (roleId: number, perm: PermissionSummary) => void;
    onRemove: (roleId: number, permId: number) => void;
    loading?: boolean;
}
const PermissionsModal: React.FC<PermissionsModalProps> = ({ open, role, onCancel, onAdd, onRemove, loading = false }) => {
    const [permName, setPermName] = useState("");
    if (!open || !role) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[640px] max-h-[80vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Gestisci permessi: {role.name}</h3>

                <div className="mb-4">
                    <div className="flex gap-2">
                        <input className="flex-1 p-2 border rounded text-sm" placeholder="Nome permesso" value={permName} onChange={(e) => setPermName(e.target.value)} />
                        <button
                            className="px-3 py-2 rounded bg-green-600 text-white"
                            onClick={() => {
                                if (!permName.trim()) return;
                                onAdd(role.id, { id: Date.now(), name: permName.trim() });
                                setPermName("");
                            }}
                        >
                            Aggiungi
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {role.permissions.length === 0 ? (
                        <div className="text-sm text-gray-500">Nessun permesso assegnato</div>
                    ) : (
                        role.permissions.map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-3 border rounded">
                                <div>
                                    <div className="font-medium text-gray-900">{p.name}</div>
                                    <div className="text-xs text-gray-500">{p.description || ""}</div>
                                </div>
                                <button className="px-2 py-1 text-sm text-red-600" onClick={() => onRemove(role.id, p.id)} disabled={loading}>
                                    Rimuovi
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={onCancel} disabled={loading}>
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Page principale RolesScreen ---
const RolesScreen: React.FC = () => {
    const [roles, setRoles] = useState<RoleDetail[]>([]);
    const [lists, setLists] = useState<ListSummary[]>([]); // per il select delle liste
    const [loading, setLoading] = useState(true);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "org" | "list">("all");

    // modals / UI state
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [roleToAct, setRoleToAct] = useState<RoleDetail | null>(null);
    const [showRoleForm, setShowRoleForm] = useState(false);
    const [showPermModal, setShowPermModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                const [r, ls] = await Promise.all([roleService.getAll(), roleService.getLists()]);
                if (!cancelled) {
                    setRoles(r);
                    setLists(ls);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const filteredRoles = useMemo(() => {
        let out = roles;
        if (filterType === "org") out = roles.filter((r) => r.list === null);
        if (filterType === "list") out = roles.filter((r) => r.list !== null);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            out = out.filter((r) => r.name.toLowerCase().includes(q) || (r.list?.name || "").toLowerCase().includes(q));
        }
        return out;
    }, [roles, filterType, searchQuery]);

    const openDelete = (role: RoleDetail) => {
        setRoleToAct(role);
        setShowConfirmDelete(true);
    };

    const confirmDelete = async () => {
        if (!roleToAct) return;
        setActionLoading(true);
        try {
            await roleService.deleteById(roleToAct.id);
            setRoles((p) => p.filter((x) => x.id !== roleToAct.id));
            setSelectedIndex(null);
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
            setShowConfirmDelete(false);
            setRoleToAct(null);
        }
    };

    const openCreate = () => {
        setRoleToAct(null);
        setShowRoleForm(true);
    };

    const saveRole = async (payload: Omit<RoleDetail, "id" | "createdAt"> & Partial<Pick<RoleDetail, "id">>) => {
        setActionLoading(true);
        try {
            if (payload.id) {
                const updated = await roleService.update(Number(payload.id), payload);
                setRoles((p) => p.map((r) => (r.id === updated.id ? updated : r)));
            } else {
                const created = await roleService.create(payload as Omit<RoleDetail, "id" | "createdAt">);
                setRoles((p) => [created, ...p]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
            setShowRoleForm(false);
            setRoleToAct(null);
        }
    };

    const openEdit = (r: RoleDetail) => {
        setRoleToAct(r);
        setShowRoleForm(true);
    };

    const openPermissions = (r: RoleDetail) => {
        setRoleToAct(r);
        setShowPermModal(true);
    };

    const addPermission = async (roleId: number, perm: PermissionSummary) => {
        setActionLoading(true);
        try {
            const updated = await roleService.addPermission(roleId, perm);
            setRoles((p) => p.map((r) => (r.id === roleId ? updated : r)));
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
        }
    };

    const removePermission = async (roleId: number, permId: number) => {
        setActionLoading(true);
        try {
            const updated = await roleService.removePermission(roleId, permId);
            setRoles((p) => p.map((r) => (r.id === roleId ? updated : r)));
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
        }
    };

    const openRegister = () => setShowRegisterModal(true);
    const confirmRegister = async (payload: Omit<RoleDetail, "id" | "createdAt">) => {
        setActionLoading(true);
        try {
            const created = await roleService.create(payload);
            setRoles((p) => [created, ...p]);
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
            setShowRegisterModal(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#EFEFEF] overflow-hidden font-sans">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="grid grid-cols-3 gap-5 mb-6">
                            <StatCard value={roles.length} label="Ruoli totali" icon={Users} bg="bg-white" textCol="#374151" />
                            <StatCard value={lists.length} label="Liste" icon={UsersRound} bg="bg-[#d9f99d]" textCol="#285300" />
                            <StatCard value="—" label="Permessi totali" icon={UserCheck} bg="bg-white" textCol="#374151" />
                        </div>

                        <div className="flex flex-row items-start gap-6">
                            {/* LEFT */}
                            <div className="flex-[2] flex flex-col gap-4">
                                {/* Filters */}
                                <div className="p-5 bg-white rounded-[20px] shadow-sm flex gap-4 items-center">
                                    <div className="flex-1 h-[45px] bg-[#F8F9FA] rounded-[10px] flex items-center px-4">
                                        <Search size={18} className="text-gray-500 mr-2" />
                                        <input type="text" placeholder="Cerca per nome, lista ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-gray-700" />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className={`px-3 py-2 rounded text-sm ${filterType === "all" ? "bg-blue-50" : ""}`} onClick={() => setFilterType("all")}>Tutti</button>
                                        <button className={`px-3 py-2 rounded text-sm ${filterType === "org" ? "bg-blue-50" : ""}`} onClick={() => setFilterType("org")}>Organizzazione</button>
                                        <button className={`px-3 py-2 rounded text-sm ${filterType === "list" ? "bg-blue-50" : ""}`} onClick={() => setFilterType("list")}>Liste</button>
                                    </div>
                                </div>

                                {/* Roles List */}
                                <div className="bg-white rounded-[20px] shadow-sm pb-6 min-h-[400px]">
                                    <div className="p-6 pb-2 flex justify-between items-center">
                                        <h3 className="text-xl font-semibold text-gray-800">Ruoli</h3>
                                        <div className="flex gap-2">
                                            <ActionButton icon={Plus} onClick={openCreate}>Nuovo ruolo</ActionButton>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="p-10 text-center text-gray-500">Caricamento...</div>
                                    ) : filteredRoles.length === 0 ? (
                                        <div className="p-10 text-center text-gray-500">Nessun ruolo trovato</div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {filteredRoles.map((r, idx) => (
                                                <div key={r.id} onClick={() => setSelectedIndex(idx)} className={`px-6 py-4 border-b border-gray-100 flex items-center cursor-pointer transition-colors hover:bg-gray-50 ${selectedIndex === idx ? "bg-blue-50/50" : ""}`}>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: r.color }}>
                                                                <span className="text-white text-sm font-semibold">{r.name.slice(0, 2).toUpperCase()}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[17px] font-semibold text-gray-900">{r.name}</h4>
                                                                <p className="text-xs text-gray-500">{r.list ? `Lista: ${r.list.name}` : "Organizzazione"} • Livello {r.level}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button className="p-2 bg-[#336900] text-white rounded-[8px] hover:bg-[#285300] transition" onClick={(e) => { e.stopPropagation(); openEdit(r); }} title="Modifica">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="p-2 bg-gray-200 text-gray-700 rounded-[8px] hover:bg-gray-300 transition" onClick={(e) => { e.stopPropagation(); openPermissions(r); }} title="Permessi">
                                                            <ShieldOff size={16} />
                                                        </button>
                                                        <button className="p-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition" onClick={(e) => { e.stopPropagation(); openDelete(r); }} title="Elimina">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex-[2] flex flex-col gap-6">
                                <div className="p-7 bg-white rounded-[20px] shadow-sm flex flex-col items-center">
                                    {selectedIndex !== null && roles[selectedIndex] ? (
                                        <>
                                            <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: AppColor.secondary }}>
                                                <span className="text-[40px] font-semibold text-[#336900]">{roles[selectedIndex].name.slice(0, 2).toUpperCase()}</span>
                                            </div>
                                            <h2 className="text-2xl font-semibold text-gray-900 text-center">{roles[selectedIndex].name}</h2>
                                            <p className="text-[15px] text-gray-500 mt-2 text-center">{roles[selectedIndex].list ? `Lista: ${roles[selectedIndex].list?.name}` : "Ruolo di organizzazione"}</p>

                                            <div className="w-full h-px bg-gray-200 my-6"></div>

                                            <div className="w-full mb-4">
                                                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Livello</p>
                                                <p className="text-sm text-gray-900">{roles[selectedIndex].level}</p>
                                            </div>

                                            <div className="w-full h-px bg-gray-200 mb-4"></div>

                                            <div className="w-full mb-6">
                                                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Permessi</p>
                                                <div className="flex flex-col gap-2">
                                                    {roles[selectedIndex].permissions.length === 0 ? (
                                                        <div className="text-sm text-gray-500">Nessun permesso assegnato</div>
                                                    ) : (
                                                        roles[selectedIndex].permissions.map((p) => (
                                                            <div key={p.id} className="text-sm text-gray-800">{p.name}</div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-full flex flex-col gap-3">
                                                <ActionButton icon={Edit} variant="secondary" onClick={() => openEdit(roles[selectedIndex])}>Modifica ruolo</ActionButton>
                                                <ActionButton icon={ShieldOff} onClick={() => openPermissions(roles[selectedIndex])}>Gestisci permessi</ActionButton>
                                                <button className="w-full py-3.5 border border-[#1e3a8a] text-[#1e3a8a] rounded-[10px] font-medium hover:bg-blue-50 transition-colors" onClick={() => { setRoleToAct(roles[selectedIndex]); setShowConfirmDelete(true); }}>
                                                    Elimina ruolo
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400 py-10">Nessun ruolo selezionato</div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <ActionButton icon={Plus} onClick={openCreate}>Aggiungi ruolo</ActionButton>
                                        </div>
                                        <div className="flex-1">
                                            <ActionButton variant="secondary" icon={Edit} onClick={() => setShowRoleForm(true)}>Modifica ruoli multipli</ActionButton>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <ActionButton icon={UsersRound} onClick={openRegister}>Registra ruoli multipli</ActionButton>
                                        </div>
                                        <div className="flex-1">
                                            <ActionButton icon={UserCheck} onClick={() => setShowPermModal(true)}>Altro</ActionButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <ConfirmModal open={showConfirmDelete} title="Elimina ruolo" message={`Sei sicuro di voler eliminare il ruolo "${roleToAct?.name}"?`} onCancel={() => setShowConfirmDelete(false)} onConfirm={confirmDelete} loading={actionLoading} confirmLabel="Elimina" />

            <RoleFormModal open={showRoleForm} role={roleToAct} lists={lists} onCancel={() => { setShowRoleForm(false); setRoleToAct(null); }} onSave={saveRole} loading={actionLoading} />

            <PermissionsModal open={showPermModal} role={roleToAct} onCancel={() => { setShowPermModal(false); setRoleToAct(null); }} onAdd={addPermission} onRemove={removePermission} loading={actionLoading} />

            {/* Register modal (re-uses RoleFormModal semantics via confirmRegister) */}
            {/* For convenience openRegister -> uses RoleFormModal with null role but direct onSave to confirmRegister */}
            <RoleFormModal open={showRegisterModal} role={null} lists={lists} onCancel={() => setShowRegisterModal(false)} onSave={(p) => confirmRegister(p as Omit<RoleDetail, "id" | "createdAt">)} loading={actionLoading} />
        </div>
    );
};

export default RolesScreen;