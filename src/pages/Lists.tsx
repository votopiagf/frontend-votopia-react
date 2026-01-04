import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Trash2,
    Edit,
    Download,
    Plus,
    FileText,
    Image, Users
} from "lucide-react";
import { AppColor } from "@/styles/colors";
import { ActionButton } from "@/components/ui/action-button";
import { listsService } from "@/services/lists.service";

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

    // actions
    const openEdit = (l: ListDetail) => { setEditTarget(l); setShowEdit(true); };
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

    return (
        <div className="flex h-screen w-full bg-[#EFEFEF] overflow-hidden font-sans">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="grid grid-cols-3 gap-5 mb-6">
                            <StatCard value={lists.length} label="Liste totali" bg="bg-white" textCol="#374151" icon={FileText} />
                            <StatCard value={schools.length} label="Scuole" bg="bg-[#d9f99d]" textCol="#285300" icon={Users} />
                            <StatCard value="—" label="File caricati" bg="bg-white" textCol="#374151" icon={Image} />
                        </div>

                        <div className="flex flex-row items-start gap-6">
                            {/* LEFT */}
                            <div className="flex-[2] flex flex-col gap-4">
                                <div className="p-5 bg-white rounded-[20px] shadow-sm flex gap-4 items-center">
                                    <div className="flex-1 h-[45px] bg-[#F8F9FA] rounded-[10px] flex items-center px-4">
                                        <Search size={18} className="text-gray-500 mr-2" />
                                        <input type="text" placeholder="Cerca per nome, scuola ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-gray-700" />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <ActionButton icon={Plus} onClick={openCreate}>Nuova lista</ActionButton>
                                    </div>
                                </div>

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
                                            {filtered.map((l, idx) => (
                                                <div key={l.id} onClick={() => setSelectedIndex(idx)} className={`px-6 py-4 border-b border-gray-100 flex items-center cursor-pointer transition-colors hover:bg-gray-50 ${selectedIndex === idx ? 'bg-blue-50/50' : ''}`}>
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
                                    {selectedIndex !== null && lists[selectedIndex] ? (
                                        <>
                                            <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: AppColor.secondary }}>
                                                <span className="text-[20px] font-semibold text-[#336900]">{lists[selectedIndex].name.slice(0,2).toUpperCase()}</span>
                                            </div>

                                            <h2 className="text-2xl font-semibold text-gray-900 text-center">{lists[selectedIndex].name}</h2>
                                            <p className="text-[15px] text-gray-500 mt-2 text-center">{lists[selectedIndex].slogan}</p>

                                            <div className="w-full h-px bg-gray-200 my-6"></div>

                                            <div className="w-full mb-4">
                                                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Descrizione</p>
                                                <p className="text-sm text-gray-900">{lists[selectedIndex].description}</p>
                                            </div>

                                            <div className="w-full h-px bg-gray-200 mb-4"></div>

                                            <div className="w-full mb-6">
                                                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Scuola</p>
                                                <p className="text-sm text-gray-900">{lists[selectedIndex].school ? lists[selectedIndex].school.name : "Nessuna"}</p>
                                            </div>

                                            <div className="w-full flex flex-col gap-3">
                                                <ActionButton icon={Download}>Esporta</ActionButton>
                                                <ActionButton icon={Edit} variant="secondary" onClick={() => openEdit(lists[selectedIndex])}>Modifica</ActionButton>
                                                <button className="w-full py-3.5 border border-[#1e3a8a] text-[#1e3a8a] rounded-[10px] font-medium hover:bg-blue-50 transition-colors" onClick={() => { setEditTarget(lists[selectedIndex]); setShowConfirmDelete(true); }}>
                                                    Elimina lista
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400 py-10">Nessuna lista selezionata</div>
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

                        <EditListModal open={showRegister} list={null} schools={schools} onCancel={() => setShowRegister(false)} onSave={(p) => saveList(p as any)} loading={actionLoading} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ListsScreen;