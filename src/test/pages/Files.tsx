import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Trash2,
    Edit,
    Download,
    Plus,
    FileText,
    Users as UsersIcon,
    Upload
} from "lucide-react";
import { AppColor } from "@/test/styles/colors.ts";
import { ActionButton } from "@/test/components/ui/action-button.tsx";
import { filesService } from "@/test/services/files.service.ts";

// Tipi usati in pagina
export interface ListSummary {
    id: number;
    name: string;
}

export interface UserSummary {
    id: number;
    name: string;
    email?: string;
}

export type FileCategory = "image" | "document" | "video" | "other";

export interface FileDetail {
    id: number;
    name: string;
    list: ListSummary | null;
    user: UserSummary | null;
    fileCategory: FileCategory;
    filePath: string;
    mimeType: string;
    uploadedAt: Date;
    url?: string;
    size?: number;
}

// --- Small stat card (stile coerente con Users/Lists) ---
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

// --- Reusable Confirm Modal ---
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

// --- Upload Modal (simulato) ---
interface UploadModalProps {
    open: boolean;
    lists: ListSummary[];
    users: UserSummary[];
    onCancel: () => void;
    onUpload: (payload: Omit<FileDetail, "id" | "uploadedAt" | "url"> & Partial<Pick<FileDetail, "url">>) => void;
    loading?: boolean;
}
const UploadModal: React.FC<UploadModalProps> = ({ open, lists, users, onCancel, onUpload, loading = false }) => {
    const [name, setName] = useState("");
    const [listId, setListId] = useState<number | "null">("null");
    const [userId, setUserId] = useState<number | "null">("null");
    const [category, setCategory] = useState<FileCategory>("document");
    const [mimeType, setMimeType] = useState("application/pdf");
    const [size, setSize] = useState<number | undefined>(undefined);
    const [filePath, setFilePath] = useState("/mocks/");

    useEffect(() => {
        if (!open) {
            setName("");
            setListId("null");
            setUserId("null");
            setCategory("document");
            setMimeType("application/pdf");
            setSize(undefined);
            setFilePath("/mocks/");
        }
    }, [open]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[640px] max-h-[90vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Carica file</h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-600">Nome file</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Categoria</label>
                        <select className="w-full mt-1 p-2 border rounded text-sm" value={category} onChange={(e) => setCategory(e.target.value as FileCategory)}>
                            <option value="image">Image</option>
                            <option value="document">Document</option>
                            <option value="video">Video</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Lista</label>
                        <select className="w-full mt-1 p-2 border rounded text-sm" value={listId} onChange={(e) => setListId(e.target.value === "null" ? "null" : Number(e.target.value))}>
                            <option value="null">Nessuna</option>
                            {lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Utente (uploader)</label>
                        <select className="w-full mt-1 p-2 border rounded text-sm" value={userId} onChange={(e) => setUserId(e.target.value === "null" ? "null" : Number(e.target.value))}>
                            <option value="null">Sistema</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Mime type</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={mimeType} onChange={(e) => setMimeType(e.target.value)} />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Size (bytes)</label>
                        <input type="number" className="w-full mt-1 p-2 border rounded text-sm" value={size ?? ""} onChange={(e) => setSize(e.target.value ? Number(e.target.value) : undefined)} />
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600">Path simulato</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={filePath} onChange={(e) => setFilePath(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={onCancel} disabled={loading}>Annulla</button>
                    <button className="px-4 py-2 rounded-[8px] bg-green-600 text-white"
                            onClick={() =>
                                onUpload({
                                    name: name || `file-${Date.now()}`,
                                    list: listId === "null" ? null : lists.find(l => l.id === listId) || null,
                                    user: userId === "null" ? null : users.find(u => u.id === userId) || null,
                                    fileCategory: category,
                                    filePath,
                                    mimeType,
                                    size,
                                })
                            }
                            disabled={loading || !name}
                    >
                        {loading ? "Caricamento..." : "Carica"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Edit Metadata Modal ---
interface EditFileModalProps {
    open: boolean;
    file: FileDetail | null;
    lists: ListSummary[];
    users: UserSummary[];
    onCancel: () => void;
    onSave: (payload: FileDetail) => void;
    loading?: boolean;
}
const EditFileModal: React.FC<EditFileModalProps> = ({ open, file, lists, users, onCancel, onSave, loading = false }) => {
    const [form, setForm] = useState<FileDetail | null>(file ?? null);

    useEffect(() => {
        setForm(file ? { ...file } : null);
    }, [file]);

    if (!open || !form) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[640px] max-h-[90vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Modifica file</h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-600">Nome</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Categoria</label>
                        <select className="w-full mt-1 p-2 border rounded text-sm" value={form.fileCategory} onChange={(e) => setForm({ ...form, fileCategory: e.target.value as FileCategory })}>
                            <option value="image">Image</option>
                            <option value="document">Document</option>
                            <option value="video">Video</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Lista</label>
                        <select className="w-full mt-1 p-2 border rounded text-sm" value={form.list ? String(form.list.id) : ""} onChange={(e) => {
                            const id = e.target.value ? Number(e.target.value) : "";
                            setForm({ ...form, list: id ? lists.find(l => l.id === id) || null : null });
                        }}>
                            <option value="">Nessuna</option>
                            {lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Uploader</label>
                        <select className="w-full mt-1 p-2 border rounded text-sm" value={form.user ? String(form.user.id) : ""} onChange={(e) => {
                            const id = e.target.value ? Number(e.target.value) : "";
                            setForm({ ...form, user: id ? users.find(u => u.id === id) || null : null });
                        }}>
                            <option value="">Sistema</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Mime type</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.mimeType} onChange={(e) => setForm({ ...form, mimeType: e.target.value })} />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Size</label>
                        <input type="number" className="w-full mt-1 p-2 border rounded text-sm" value={form.size ?? ""} onChange={(e) => setForm({ ...form, size: e.target.value ? Number(e.target.value) : undefined })} />
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600">Path</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.filePath} onChange={(e) => setForm({ ...form, filePath: e.target.value })} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={onCancel} disabled={loading}>Annulla</button>
                    <button className="px-4 py-2 rounded-[8px] bg-blue-600 text-white" onClick={() => onSave(form)} disabled={loading}>
                        {loading ? "Salvando..." : "Salva"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Bulk Delete Modal (selezione) ---
interface BulkDeleteModalProps {
    open: boolean;
    files: FileDetail[];
    onCancel: () => void;
    onConfirm: (ids: number[]) => void;
    loading?: boolean;
}
const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({ open, files, onCancel, onConfirm, loading = false }) => {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (!open) setSelectedIds(new Set());
    }, [open]);

    const toggle = (id: number) => setSelectedIds(prev => {
        const c = new Set(prev);
        c.has(id) ? c.delete(id) : c.add(id);
        return c;
    });

    const selectAll = () => setSelectedIds(new Set(files.map(f => f.id)));
    const clearAll = () => setSelectedIds(new Set());

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[720px] max-h-[80vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Elimina file multipli</h3>
                <p className="text-sm text-gray-600 mb-4">Seleziona i file da eliminare.</p>

                <div className="flex gap-3 mb-3">
                    <button className="px-3 py-1 border rounded text-sm" onClick={selectAll}>Seleziona tutti</button>
                    <button className="px-3 py-1 border rounded text-sm" onClick={clearAll}>Deseleziona</button>
                </div>

                <div className="space-y-2">
                    {files.map(f => (
                        <label key={f.id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                                <div className="font-medium text-gray-900">{f.name}</div>
                                <div className="text-xs text-gray-500">{f.list ? f.list.name : "Global"} • {f.user ? f.user.name : "Sistema"}</div>
                            </div>
                            <input type="checkbox" checked={selectedIds.has(f.id)} onChange={() => toggle(f.id)} />
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={onCancel} disabled={loading}>Annulla</button>
                    <button className="px-4 py-2 rounded-[8px] bg-red-600 text-white" onClick={() => onConfirm(Array.from(selectedIds))} disabled={loading || selectedIds.size === 0}>
                        {loading ? "Eliminando..." : `Elimina (${selectedIds.size})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Page principale FilesScreen ---
const FilesScreen: React.FC = () => {
    const [files, setFiles] = useState<FileDetail[]>([]);
    const [lists, setLists] = useState<ListSummary[]>([]);
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<"all" | FileCategory | "list" | "user">("all");

    // modals state
    const [showUpload, setShowUpload] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editTarget, setEditTarget] = useState<FileDetail | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                const [f, ls, us] = await Promise.all([filesService.getAll(), filesService.getLists(), filesService.getUsers()]);
                if (!cancelled) {
                    setFiles(f);
                    setLists(ls);
                    setUsers(us);
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
        let out = files;
        if (filterCategory !== "all") {
            if (filterCategory === "list") out = out.filter(f => f.list !== null);
            else if (filterCategory === "user") out = out.filter(f => f.user !== null);
            else out = out.filter(f => f.fileCategory === filterCategory);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            out = out.filter(f => f.name.toLowerCase().includes(q) || f.filePath.toLowerCase().includes(q) || (f.list?.name || "").toLowerCase().includes(q) || (f.user?.name || "").toLowerCase().includes(q));
        }
        return out;
    }, [files, filterCategory, searchQuery]);

    // actions
    const openEdit = (f: FileDetail) => { setEditTarget(f); setShowEdit(true); };
    const openDelete = (f: FileDetail) => { setEditTarget(f); setShowConfirmDelete(true); };

    const confirmDelete = async () => {
        if (!editTarget) return;
        setActionLoading(true);
        try {
            await filesService.deleteById(editTarget.id);
            setFiles(prev => prev.filter(p => p.id !== editTarget.id));
            setSelectedIndex(null);
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
            setShowConfirmDelete(false);
            setEditTarget(null);
        }
    };

    const handleUpload = async (payload: Omit<FileDetail, "id" | "uploadedAt" | "url"> & Partial<Pick<FileDetail, "url">>) => {
        setActionLoading(true);
        try {
            const created = await filesService.uploadFileSimulated(payload);
            setFiles(prev => [created, ...prev]);
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
            setShowUpload(false);
        }
    };

    const handleSaveEdit = async (updated: FileDetail) => {
        setActionLoading(true);
        try {
            const res = await filesService.update(updated.id, updated);
            setFiles(prev => prev.map(p => p.id === res.id ? res : p));
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
            setShowEdit(false);
            setEditTarget(null);
        }
    };

    const openBulkDeleteModal = () => setShowBulkDelete(true);
    const confirmBulkDelete = async (ids: number[]) => {
        if (ids.length === 0) return;
        setActionLoading(true);
        try {
            await filesService.deleteMany(ids);
            setFiles(prev => prev.filter(f => !ids.includes(f.id)));
            setSelectedIndex(null);
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
            setShowBulkDelete(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#EFEFEF] overflow-hidden font-sans">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="grid grid-cols-3 gap-5 mb-6">
                            <StatCard value={files.length} label="File totali" bg="bg-white" textCol="#374151" icon={FileText} />
                            <StatCard value={lists.length} label="Liste collegate" bg="bg-[#d9f99d]" textCol="#285300" icon={UsersIcon} />
                            <StatCard value={users.length} label="Uploader" bg="bg-white" textCol="#374151" icon={Download} />
                        </div>

                        <div className="flex flex-row items-start gap-6">
                            {/* LEFT */}
                            <div className="flex-[2] flex flex-col gap-4">
                                <div className="p-5 bg-white rounded-[20px] shadow-sm flex gap-4 items-center">
                                    <div className="flex-1 h-[45px] bg-[#F8F9FA] rounded-[10px] flex items-center px-4">
                                        <Search size={18} className="text-gray-500 mr-2" />
                                        <input type="text" placeholder="Cerca per nome, path, uploader ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-gray-700" />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className={`px-3 py-2 rounded text-sm ${filterCategory === "all" ? "bg-blue-50" : ""}`} onClick={() => setFilterCategory("all")}>Tutti</button>
                                        <button className={`px-3 py-2 rounded text-sm ${filterCategory === "image" ? "bg-blue-50" : ""}`} onClick={() => setFilterCategory("image")}>Immagini</button>
                                        <button className={`px-3 py-2 rounded text-sm ${filterCategory === "document" ? "bg-blue-50" : ""}`} onClick={() => setFilterCategory("document")}>Documenti</button>
                                        <button className={`px-3 py-2 rounded text-sm ${filterCategory === "user" ? "bg-blue-50" : ""}`} onClick={() => setFilterCategory("user")}>Uploader</button>
                                        <button className={`px-3 py-2 rounded text-sm ${filterCategory === "list" ? "bg-blue-50" : ""}`} onClick={() => setFilterCategory("list")}>Liste</button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[20px] shadow-sm pb-6 min-h-[400px]">
                                    <div className="p-6 pb-2 flex justify-between items-center">
                                        <h3 className="text-xl font-semibold text-gray-800">File</h3>
                                        <div className="flex gap-2">
                                            <ActionButton icon={Upload} onClick={() => setShowUpload(true)}>Carica</ActionButton>
                                            <ActionButton icon={Plus} onClick={openBulkDeleteModal}>Azioni multiple</ActionButton>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="p-10 text-center text-gray-500">Caricamento...</div>
                                    ) : filtered.length === 0 ? (
                                        <div className="p-10 text-center text-gray-500">Nessun file trovato</div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {filtered.map((f, idx) => (
                                                <div key={f.id} onClick={() => setSelectedIndex(idx)} className={`px-6 py-4 border-b border-gray-100 flex items-center cursor-pointer transition-colors hover:bg-gray-50 ${selectedIndex === idx ? 'bg-blue-50/50' : ''}`}>
                                                    <div className="flex-1">
                                                        <h4 className="text-[17px] font-semibold text-gray-900">{f.name}</h4>
                                                        <p className="text-sm text-gray-500 mt-1">{f.filePath}</p>
                                                        <div className="mt-2 text-xs text-gray-600">{f.list ? f.list.name : "Global"} • {f.user ? f.user.name : "Sistema"} • {f.mimeType}</div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button className="p-2 bg-[#336900] text-white rounded-[8px] hover:bg-[#285300] transition" onClick={(e) => { e.stopPropagation(); openEdit(f); }} title="Modifica">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="p-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition" onClick={(e) => { e.stopPropagation(); openDelete(f); }} title="Elimina">
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
                                    {selectedIndex !== null && files[selectedIndex] ? (
                                        <>
                                            <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: AppColor.secondary }}>
                                                <span className="text-[20px] font-semibold text-[#336900]">{files[selectedIndex].name.slice(0,2).toUpperCase()}</span>
                                            </div>

                                            <h2 className="text-2xl font-semibold text-gray-900 text-center">{files[selectedIndex].name}</h2>
                                            <p className="text-[15px] text-gray-500 mt-2 text-center">{files[selectedIndex].fileCategory} • {files[selectedIndex].mimeType}</p>

                                            <div className="w-full h-px bg-gray-200 my-6"></div>

                                            <div className="w-full mb-4">
                                                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Path</p>
                                                <p className="text-sm text-gray-900">{files[selectedIndex].filePath}</p>
                                            </div>

                                            <div className="w-full h-px bg-gray-200 mb-4"></div>

                                            <div className="w-full mb-6">
                                                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Uploader</p>
                                                <p className="text-sm text-gray-900">{files[selectedIndex].user ? files[selectedIndex].user.name : "Sistema"}</p>
                                            </div>

                                            <div className="w-full flex flex-col gap-3">
                                                <ActionButton icon={Download}>Scarica</ActionButton>
                                                <ActionButton icon={Edit} variant="secondary" onClick={() => { if (selectedIndex !== null) openEdit(files[selectedIndex]); }}>Modifica metadati</ActionButton>
                                                <button className="w-full py-3.5 border border-[#1e3a8a] text-[#1e3a8a] rounded-[10px] font-medium hover:bg-blue-50 transition-colors" onClick={() => { setEditTarget(files[selectedIndex]); setShowConfirmDelete(true); }}>
                                                    Elimina file
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400 py-10">Nessun file selezionato</div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <ActionButton icon={Upload} onClick={() => setShowUpload(true)}>Carica file</ActionButton>
                                        </div>
                                        <div className="flex-1">
                                            <ActionButton variant="secondary" icon={Edit} onClick={() => setShowEdit(true)}>Modifica metadati multipli</ActionButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modals */}
                        <ConfirmModal open={showConfirmDelete} title="Elimina file" message={`Sei sicuro di voler eliminare il file "${editTarget?.name}"?`} onCancel={() => setShowConfirmDelete(false)} onConfirm={confirmDelete} loading={actionLoading} confirmLabel="Elimina" />

                        <UploadModal open={showUpload} lists={lists} users={users} onCancel={() => setShowUpload(false)} onUpload={handleUpload} loading={actionLoading} />

                        <EditFileModal open={showEdit} file={editTarget} lists={lists} users={users} onCancel={() => { setShowEdit(false); setEditTarget(null); }} onSave={handleSaveEdit} loading={actionLoading} />

                        <BulkDeleteModal open={showBulkDelete} files={files} onCancel={() => setShowBulkDelete(false)} onConfirm={confirmBulkDelete} loading={actionLoading} />

                    </div>
                </main>
            </div>
        </div>
    );
};

export default FilesScreen;