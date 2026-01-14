import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Trash2,
    Edit,
    Download,
    Plus,
    FileText,
    Image,
    Users as UsersIcon,
    ChevronDown,
    ShieldOff,
    FileText as FileIcon,
    ArrowRightCircle,
    ArrowLeft
} from "lucide-react";
import { AppColor } from "@/test/styles/colors.ts";
import { ActionButton } from "@/test/components/ui/action-button.tsx";
import { listsService } from "@/test/services/lists.service.ts";
import { rolesService } from "@/test/services/roles.service.ts";
import { filesService } from "@/test/services/files.service.ts";

// Tipi exportabili
export interface SchoolSummary {
    id: number;
    name: string;
}

export interface FileSummary {
    id: number;
    name: string;
    url?: string;
    size?: number;
}

export interface ListDetail {
    id: number;
    name: string;
    description: string;
    school: SchoolSummary | null;
    slogan: string;
    colorPrimary: string;
    colorSecondary: string;
    file?: FileSummary | null;
    createdAt: Date;
}

// Small stat card (stile coerente)
interface StatCardProps {
    value: string | number;
    label: string;
    bg: string;
    textCol: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}
const StatCard: React.FC<StatCardProps> = ({ value, label, bg, textCol, icon: Icon }) => (
    <div className={`p-6 rounded-[20px] shadow-lg flex justify-between items-center ${bg}`}>
        <div className="flex flex-col">
            <span className="text-sm font-extrabold mb-2" style={{ color: bg === "bg-white" ? "#4b5563" : textCol }}>
                {label}
            </span>
            <span className="text-5xl font-bold leading-none tracking-tighter" style={{ color: textCol }}>
                {value}
            </span>
        </div>
        {Icon && (
            <div className={`p-4 rounded-full ${bg === 'bg-white' ? 'bg-gray-100' : 'bg-white/20'}`}>
                <Icon className="w-8 h-8" style={{ color: bg === 'bg-white' ? '#4b5563' : textCol }} />
            </div>
        )}
    </div>
);

// Confirm modal reuse
interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, title = "Conferma", message, onConfirm, onCancel, loading = false, confirmLabel = "Conferma", cancelLabel = "Annulla" }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[480px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100 text-gray-700" onClick={onCancel} disabled={loading}>{cancelLabel}</button>
                    <button className="px-4 py-2 rounded-[8px] bg-red-600 text-white" onClick={onConfirm} disabled={loading}>
                        {loading ? "Elaborazione..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Edit / Create modal
interface EditListModalProps {
    open: boolean;
    list: ListDetail | null;
    schools: SchoolSummary[];
    onCancel: () => void;
    onSave: (payload: Omit<ListDetail, "id" | "createdAt"> & Partial<Pick<ListDetail, "id">>) => void;
    loading?: boolean;
}
const EditListModal: React.FC<EditListModalProps> = ({ open, list, schools, onCancel, onSave, loading = false }) => {
    const [form, setForm] = useState<Omit<ListDetail, "id" | "createdAt">>({
        name: "",
        description: "",
        school: null,
        slogan: "",
        colorPrimary: "#336900",
        colorSecondary: "#ffffff",
        file: null,
    });

    useEffect(() => {
        if (!open) return;
        if (list) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({
                name: list.name,
                description: list.description,
                school: list.school,
                slogan: list.slogan,
                colorPrimary: list.colorPrimary,
                colorSecondary: list.colorSecondary,
                file: list.file || null,
            });
        } else {
            setForm({
                name: "",
                description: "",
                school: null,
                slogan: "",
                colorPrimary: "#336900",
                colorSecondary: "#ffffff",
                file: null,
            });
        }
    }, [open, list]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[640px] max-h-[90vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{list ? "Modifica lista" : "Nuova lista"}</h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-600">Nome</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Slogan</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.slogan} onChange={(e) => setForm({ ...form, slogan: e.target.value })} />
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600">Descrizione</label>
                        <textarea className="w-full mt-1 p-2 border rounded text-sm" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Scuola</label>
                        <select className="w-full mt-1 p-2 border rounded text-sm" value={form.school ? String(form.school.id) : ""} onChange={(e) => {
                            const id = e.target.value ? Number(e.target.value) : "";
                            setForm({ ...form, school: id ? schools.find(s => s.id === id) || null : null });
                        }}>
                            <option value="">Nessuna</option>
                            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Color primary</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.colorPrimary} onChange={(e) => setForm({ ...form, colorPrimary: e.target.value })} />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Color secondary</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.colorSecondary} onChange={(e) => setForm({ ...form, colorSecondary: e.target.value })} />
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600">File (logo/immagine)</label>
                        <div className="mt-1 flex items-center gap-3">
                            <input type="text" placeholder="Nome file (simulazione)" className="flex-1 p-2 border rounded text-sm" value={form.file?.name || ""} onChange={(e) => setForm({ ...form, file: { id: form.file?.id || Date.now(), name: e.target.value } })} />
                            <button className="px-3 py-2 rounded bg-gray-100" onClick={() => setForm({ ...form, file: form.file ? null : { id: Date.now(), name: "uploaded.png" } })}>{form.file ? "Rimuovi" : "Aggiungi"}</button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={onCancel} disabled={loading}>Annulla</button>
                    <button className="px-4 py-2 rounded-[8px] bg-blue-600 text-white" onClick={() => onSave({ ...form })} disabled={loading || !form.name}>
                        {loading ? "Salvando..." : list ? "Salva" : "Crea"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ListsScreen: React.FC = () => {
    const [lists, setLists] = useState<ListDetail[]>([]);
    const [schools, setSchools] = useState<SchoolSummary[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // modals state
    const [showEdit, setShowEdit] = useState(false);
    const [editTarget, setEditTarget] = useState<ListDetail | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    // tabs (unisci la visualizzazione di ListMenu)
    const tabs = ["Overview", "Members", "Roles", "Files", "Settings"] as const;
    type Tab = typeof tabs[number];
    const [activeTab, setActiveTab] = useState<Tab>("Overview");

    // related counts for selected list
    const [rolesCount, setRolesCount] = useState<number | null>(null);
    const [filesCount, setFilesCount] = useState<number | null>(null);
    const [members, setMembers] = useState<{ id: number; name: string; email?: string; role?: string }[]>([]);

    // enter view state: quando si entra nella lista mostra vista "interna" a tutto schermo
    const [inListView, setInListView] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                const [ls, sc] = await Promise.all([listsService.getAll(), listsService.getSchools()]);
                if (!cancelled) {
                    setLists(ls);
                    setSchools(sc);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    const filtered = useMemo(() => {
        if (!searchQuery) return lists;
        const q = searchQuery.toLowerCase();
        return lists.filter(l => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || (l.school?.name || "").toLowerCase().includes(q));
    }, [lists, searchQuery]);

    const selected = selectedIndex !== null ? lists[selectedIndex] : null;

    useEffect(() => {
        const loadRelated = async () => {
            if (!selected) {
                setRolesCount(null);
                setFilesCount(null);
                setMembers([]);
                return;
            }
            setRolesCount(null);
            setFilesCount(null);
            try {
                const allRoles = await rolesService.getAll();
                setRolesCount(allRoles.filter(r => r.list && r.list.id === selected.id).length);
            } catch {
                setRolesCount(0);
            }
            try {
                const allFiles = await filesService.getAll();
                setFilesCount(allFiles.filter(f => f.list && f.list.id === selected.id).length);
            } catch {
                setFilesCount(0);
            }
            // members mock
            setMembers([
                { id: 1, name: "Mario Rossi", email: "mario.rossi@example.com", role: "Admin" },
                { id: 2, name: "Giulia Bianchi", email: "giulia.b@example.com", role: "Moderator" },
            ]);
        };
        loadRelated();
    }, [selected]);

    // actions
    const openEdit = (l: ListDetail | null) => { setEditTarget(l); setShowEdit(true); };
    const openCreate = () => { setEditTarget(null); setShowEdit(true); };

    const saveList = async (payload: Omit<ListDetail, "id" | "createdAt"> & Partial<Pick<ListDetail, "id">>) => {
        setActionLoading(true);
        try {
            if (payload.id) {
                const updated = await listsService.update(Number(payload.id), payload);
                setLists(prev => prev.map(p => p.id === updated.id ? updated : p));
            } else {
                const created = await listsService.create(payload as Omit<ListDetail, "id" | "createdAt">);
                setLists(prev => [created, ...prev]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
            setShowEdit(false);
            setEditTarget(null);
        }
    };

    const openDelete = (l: ListDetail) => { setEditTarget(l); setShowConfirmDelete(true); };
    const confirmDelete = async () => {
        if (!editTarget) return;
        setActionLoading(true);
        try {
            await listsService.deleteById(editTarget.id);
            setLists(prev => prev.filter(p => p.id !== editTarget.id));
            setSelectedIndex(null);
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
            setShowConfirmDelete(false);
            setEditTarget(null);
        }
    };

    // quando si clicca su una lista, entrare nella sua overview (tab Overview)
    const selectList = (idx: number) => {
        setSelectedIndex(idx);
        setActiveTab("Overview");
    };

    // entra nella vista interna della lista (full-screen style, mantiene activeTab)
    const enterList = () => {
        if (!selected) return;
        setInListView(true);
    };

    const exitList = () => {
        setInListView(false);
    };

    return (
        <div className="flex h-screen w-full bg-[#EFEFEF] overflow-hidden font-sans">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="grid grid-cols-3 gap-5 mb-6">
                            <StatCard value={lists.length} label="Liste totali" bg="bg-white" textCol="#374151" icon={FileText} />
                            <StatCard value={schools.length} label="Scuole" bg="bg-[#d9f99d]" textCol="#285300" icon={UsersIcon} />
                            <StatCard value={filesCount ?? "—"} label="File collegati (selezione)" bg="bg-white" textCol="#374151" icon={Image} />
                        </div>

                        <div className="p-5 bg-white rounded-[20px] shadow-sm flex gap-4 items-center mb-6">
                            <div className="flex-1 h-[45px] bg-[#F8F9FA] rounded-[10px] flex items-center px-4">
                                <Search size={18} className="text-gray-500 mr-2" />
                                <input type="text" placeholder="Cerca per nome, scuola ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-gray-700" />
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#F8F9FA] rounded text-sm text-gray-700 cursor-pointer">
                                    Filtri
                                    <ChevronDown size={16} />
                                </div>
                                <ActionButton icon={Plus} onClick={openCreate}>Nuova lista</ActionButton>
                                <ActionButton icon={Download}>Esporta</ActionButton>
                                <ActionButton icon={Plus} onClick={() => setShowRegister(true)}>Registra nuova lista</ActionButton>
                            </div>
                        </div>

                        <div className="flex flex-row items-start gap-6">
                            {/* LEFT: hide when inListView */}
                            {!inListView && (
                                <div className="flex-[2] flex flex-col gap-4">
                                    <div className="bg-white rounded-[20px] shadow-sm pb-6 min-h-[400px]">
                                        <div className="p-6 pb-2">
                                            <h3 className="text-xl font-semibold text-gray-800">Elenco liste</h3>
                                        </div>

                                        {loading ? (
                                            <div className="p-10 text-center text-gray-500">Caricamento...</div>
                                        ) : filtered.length === 0 ? (
                                            <div className="p-10 text-center text-gray-500">Nessuna lista trovata</div>
                                        ) : (
                                            <div className="flex flex-col">
                                                {filtered.map((l) => {
                                                    const idx = lists.findIndex(x => x.id === l.id);
                                                    const isSelected = selectedIndex === idx;
                                                    return (
                                                        <div key={l.id} onClick={() => selectList(idx)} className={`px-6 py-4 border-b border-gray-100 flex items-center cursor-pointer transition-colors hover:bg-gray-50 ${isSelected ? 'bg-blue-50/50' : ''}`}>
                                                            <div className="flex-1">
                                                                <h4 className="text-[17px] font-semibold text-gray-900">{l.name}</h4>
                                                                <p className="text-sm text-gray-500 mt-1">{l.description}</p>
                                                                <div className="mt-2 text-xs text-gray-600">{l.school ? l.school.name : "No school"}</div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <button className="p-2 bg-[#336900] text-white rounded-[8px] hover:bg-[#285300] transition" onClick={(e) => { e.stopPropagation(); openEdit(l); }} title="Modifica">
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button className="p-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition" onClick={(e) => { e.stopPropagation(); openDelete(l); }} title="Elimina">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                                <button className="p-2 bg-blue-600 text-white rounded-[8px] hover:bg-blue-700 transition flex items-center gap-2" onClick={(e) => { e.stopPropagation(); selectList(idx); enterList(); }} title="Entra">
                                                                    <ArrowRightCircle size={16} /> Entra
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* RIGHT: overview + tabs — if inListView take more space */}
                            <div className={inListView ? "flex-[1] md:flex-[1]" : "flex-[2] flex flex-col gap-6"}>
                                <div className="p-7 bg-white rounded-[20px] shadow-sm flex flex-col items-stretch min-h-[400px]">
                                    {selected ? (
                                        <>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-[96px] h-[96px] rounded-full flex items-center justify-center" style={{ backgroundColor: AppColor.secondary }}>
                                                        <span className="text-[28px] font-semibold text-[#336900]">{selected.name.slice(0,2).toUpperCase()}</span>
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-semibold text-gray-900">{selected.name}</h2>
                                                        <p className="text-sm text-gray-500 mt-1">{selected.slogan || selected.description}</p>
                                                        <div className="text-xs text-gray-400 mt-2">Creata: {selected.createdAt.toLocaleDateString()}</div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-3">
                                                    <div className="flex gap-2">
                                                        <ActionButton icon={Edit} variant="secondary" onClick={() => openEdit(selected)}>Modifica</ActionButton>
                                                        <ActionButton icon={Trash2} variant="destructive" onClick={() => { setEditTarget(selected); setShowConfirmDelete(true); }}>Elimina</ActionButton>
                                                    </div>
                                                    <div className="text-sm text-gray-500">ID: {selected.id}</div>
                                                </div>
                                            </div>

                                            {/* if inListView show a small back button */}
                                            {inListView && (
                                                <div className="mt-4">
                                                    <button className="inline-flex items-center gap-2 text-sm text-gray-600" onClick={exitList}>
                                                        <ArrowLeft /> Torna alle liste
                                                    </button>
                                                </div>
                                            )}

                                            {/* Tabs */}
                                            <div className="mt-6">
                                                <div className="flex gap-3 border-b pb-3">
                                                    {tabs.map(t => (
                                                        <button key={t} className={`px-3 py-2 text-sm rounded ${activeTab === t ? "bg-blue-50 font-medium" : "text-gray-600"}`} onClick={() => setActiveTab(t as Tab)}>
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="mt-4">
                                                    {activeTab === "Overview" && (
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-3 gap-4">
                                                                <div className="p-4 rounded border">
                                                                    <div className="text-sm text-gray-500">Ruoli</div>
                                                                    <div className="text-2xl font-bold">{rolesCount ?? "—"}</div>
                                                                </div>
                                                                <div className="p-4 rounded border">
                                                                    <div className="text-sm text-gray-500">File</div>
                                                                    <div className="text-2xl font-bold">{filesCount ?? "—"}</div>
                                                                </div>
                                                                <div className="p-4 rounded border">
                                                                    <div className="text-sm text-gray-500">Membri</div>
                                                                    <div className="text-2xl font-bold">{members.length}</div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Descrizione</h4>
                                                                <p className="text-sm text-gray-600">{selected.description}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeTab === "Members" && (
                                                        <div>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h4 className="font-semibold">Membri ({members.length})</h4>
                                                                <ActionButton icon={UsersIcon}>Aggiungi membro</ActionButton>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {members.map(m => (
                                                                    <div key={m.id} className="p-3 border rounded flex items-center justify-between">
                                                                        <div>
                                                                            <div className="font-medium">{m.name}</div>
                                                                            <div className="text-xs text-gray-500">{m.email}</div>
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">{m.role}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeTab === "Roles" && (
                                                        <div>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h4 className="font-semibold">Ruoli ({rolesCount ?? "—"})</h4>
                                                                <ActionButton icon={ShieldOff}>Gestisci ruoli</ActionButton>
                                                            </div>
                                                            <div className="text-sm text-gray-500">Apri la sezione Ruoli per modificare o creare ruoli collegati a questa lista.</div>
                                                        </div>
                                                    )}

                                                    {activeTab === "Files" && (
                                                        <div>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h4 className="font-semibold">File ({filesCount ?? "—"})</h4>
                                                                <ActionButton icon={FileIcon}>Carica file</ActionButton>
                                                            </div>
                                                            <div className="text-sm text-gray-500">Visualizza e gestisci i file associati a questa lista.</div>
                                                        </div>
                                                    )}

                                                    {activeTab === "Settings" && (
                                                        <div>
                                                            <h4 className="font-semibold mb-3">Impostazioni</h4>
                                                            <div className="space-y-2">
                                                                <button className="px-4 py-2 border rounded text-sm" onClick={() => { console.log("Apri permessi avanzati"); }}>Permessi avanzati</button>
                                                                <button className="px-4 py-2 border rounded text-sm" onClick={() => { console.log("Opzioni integrazione"); }}>Integrazioni</button>
                                                                <button className="px-4 py-2 border rounded text-sm" onClick={() => { console.log("Export data"); }}>Esporta dati</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400 py-10">Seleziona una lista a sinistra per aprire l'overview.</div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <ActionButton icon={Plus} onClick={() => { setShowRegister(true); }}>Registra nuova lista</ActionButton>
                                        </div>
                                        <div className="flex-1">
                                            <ActionButton variant="secondary" icon={Edit}>Modifica liste multiple</ActionButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modals */}
                        <ConfirmModal open={showConfirmDelete} title="Elimina lista" message={`Sei sicuro di voler eliminare la lista "${editTarget?.name}"?`} onCancel={() => setShowConfirmDelete(false)} onConfirm={confirmDelete} loading={actionLoading} />
                        <EditListModal open={showEdit} list={editTarget} schools={schools} onCancel={() => { setShowEdit(false); setEditTarget(null); }} onSave={saveList} loading={actionLoading} />
                        {/* Reuse EditListModal to register too */}
                        <EditListModal open={showRegister} list={null} schools={schools} onCancel={() => setShowRegister(false)} onSave={(p) => saveList(p as never)} loading={actionLoading} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ListsScreen;