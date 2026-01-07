import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Edit,
    FileText,
    Users as UsersIcon,
    ShieldOff,
    Upload,
    Clock, Download
} from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { listsService } from "@/services/lists.service";
import { rolesService } from "@/services/roles.service";
import { filesService } from "@/services/files.service";
import type { ListDetail } from "@/pages/Lists";

// Small stat card (reused style)
const StatCard: React.FC<{ value: string | number; label: string; icon?: React.FC<React.SVGProps<SVGSVGElement>> }> = ({ value, label, icon: Icon }) => (
    <div className="p-5 rounded-[16px] shadow flex items-center justify-between bg-white">
        <div>
            <div className="text-sm text-gray-500 font-medium">{label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
        </div>
        {Icon && (
            <div className="p-3 rounded-full bg-gray-100">
                <Icon className="w-6 h-6 text-gray-700" />
            </div>
        )}
    </div>
);

interface Props {
    /**
     * Se fornito, mostra la dashboard per questa lista.
     * Altrimenti puoi passare listId.
     */
    list?: ListDetail | null;
    listId?: number;
    /**
     * Callback per tornare indietro (opzionale). Se non presente userà window.history.back().
     */
    onBack?: () => void;
}

const ListDashboard: React.FC<Props> = ({ list, listId, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState<ListDetail | null>(list ?? null);
    const [rolesCount, setRolesCount] = useState<number | null>(null);
    const [filesCount, setFilesCount] = useState<number | null>(null);
    const [members, setMembers] = useState<{ id: number; name: string; role?: string; email?: string }[]>([]);
    const [recentFiles, setRecentFiles] = useState<never[]>([]);
    const [recentRoles, setRecentRoles] = useState<never[]>([]);
    const [activeSection, setActiveSection] = useState<"overview" | "members" | "roles" | "files" | "settings">("overview");

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                let fetchedList: ListDetail | null = current;
                if (!fetchedList && listId != null) {
                    fetchedList = await listsService.getById(listId);
                }
                if (!cancelled) setCurrent(fetchedList ?? null);

                if (fetchedList) {
                    // fetch related counts and recent items
                    const [allRoles, allFiles] = await Promise.all([rolesService.getAll(), filesService.getAll()]);
                    const {length, slice} = allRoles.filter((r: any) => r.list && r.list.id === fetchedList!.id);
                    const {length: length1, sort} = allFiles.filter((f: any) => f.list && f.list.id === fetchedList!.id);

                    if (!cancelled) {
                        setRolesCount(length);
                        setFilesCount(length1);
                        // @ts-ignore
                        setRecentRoles(slice(0, 6));
                        // @ts-ignore
                        setRecentFiles(sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).slice(0, 6));
                        // members are mocked here — replace with real service if available
                        setMembers([
                            { id: 1, name: "Mario Rossi", role: "Admin", email: "mario.rossi@example.com" },
                            { id: 2, name: "Giulia Bianchi", role: "Moderator", email: "giulia.b@example.com" }
                        ]);
                    }
                }
            } catch (e) {
                console.error("Errore caricamento dashboard lista", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listId, list]);

    const handleBack = () => {
        if (onBack) return onBack();
        window.history.back();
    };

    const overviewStats = useMemo(() => ({
        roles: rolesCount ?? "—",
        files: filesCount ?? "—",
        members: members.length
    }), [rolesCount, filesCount, members.length]);

    return (
        <div className="flex h-screen w-full bg-[#f6f7f9] overflow-auto">
            <div className="flex-1 p-6 max-w-[1400px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBack} className="p-2 rounded bg-white shadow">
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{current ? current.name : "Lista"}</h1>
                            <p className="text-sm text-gray-500">{current ? (current.slogan || current.description) : "Dashboard della lista"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ActionButton icon={Edit} variant="secondary" onClick={() => console.log("Modifica lista")}>Modifica lista</ActionButton>
                        <ActionButton icon={Download}>Esporta dati</ActionButton>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard value={overviewStats.roles} label="Ruoli" icon={ShieldOff} />
                    <StatCard value={overviewStats.files} label="File" icon={FileText} />
                    <StatCard value={overviewStats.members} label="Membri" icon={UsersIcon} />
                </div>

                <div className="bg-white rounded-[16px] p-4 shadow mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setActiveSection("overview")} className={`px-3 py-2 rounded text-sm ${activeSection === "overview" ? "bg-blue-50 font-medium" : "text-gray-600"}`}>Overview</button>
                            <button onClick={() => setActiveSection("members")} className={`px-3 py-2 rounded text-sm ${activeSection === "members" ? "bg-blue-50 font-medium" : "text-gray-600"}`}>Members</button>
                            <button onClick={() => setActiveSection("roles")} className={`px-3 py-2 rounded text-sm ${activeSection === "roles" ? "bg-blue-50 font-medium" : "text-gray-600"}`}>Roles</button>
                            <button onClick={() => setActiveSection("files")} className={`px-3 py-2 rounded text-sm ${activeSection === "files" ? "bg-blue-50 font-medium" : "text-gray-600"}`}>Files</button>
                            <button onClick={() => setActiveSection("settings")} className={`px-3 py-2 rounded text-sm ${activeSection === "settings" ? "bg-blue-50 font-medium" : "text-gray-600"}`}>Settings</button>
                        </div>

                        <div className="text-sm text-gray-500">Ultimo aggiornamento: <span className="font-medium ml-2"><Clock className="inline-block mr-1" /> {current ? current.createdAt.toLocaleDateString() : "—"}</span></div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500 bg-white rounded shadow">Caricamento...</div>
                ) : (
                    <>
                        {activeSection === "overview" && (
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-2 bg-white p-5 rounded shadow">
                                    <h3 className="text-lg font-semibold mb-3">Panoramica</h3>
                                    <p className="text-sm text-gray-600 mb-4">{current?.description}</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded border">
                                            <div className="text-sm text-gray-500">Ruoli recenti</div>
                                            {recentRoles.length === 0 ? <div className="text-sm text-gray-500 mt-2">Nessun ruolo</div> : (
                                                <ul className="mt-2 space-y-2">
                                                    {recentRoles.map((r: any) => (
                                                        <li key={r.id} className="flex items-center justify-between">
                                                            <div>
                                                                <div className="font-medium">{r.name}</div>
                                                                <div className="text-xs text-gray-500">Livello {r.level}</div>
                                                            </div>
                                                            <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString?.() ?? ""}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <div className="p-4 rounded border">
                                            <div className="text-sm text-gray-500">File recenti</div>
                                            {recentFiles.length === 0 ? <div className="text-sm text-gray-500 mt-2">Nessun file</div> : (
                                                <ul className="mt-2 space-y-2">
                                                    {recentFiles.map((f: any) => (
                                                        <li key={f.id} className="flex items-center justify-between">
                                                            <div>
                                                                <div className="font-medium">{f.name}</div>
                                                                <div className="text-xs text-gray-500">{f.mimeType} • {f.size ?? "—"} bytes</div>
                                                            </div>
                                                            <div className="text-xs text-gray-400">{new Date(f.uploadedAt).toLocaleDateString?.() ?? ""}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded shadow">
                                    <h3 className="text-lg font-semibold mb-3">Azioni rapide</h3>
                                    <div className="flex flex-col gap-3">
                                        <ActionButton icon={ShieldOff}>Gestisci ruoli</ActionButton>
                                        <ActionButton icon={FileText}>File & media</ActionButton>
                                        <ActionButton icon={UsersIcon}>Gestione membri</ActionButton>
                                        <ActionButton icon={Upload}>Carica file</ActionButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === "members" && (
                            <div className="bg-white p-5 rounded shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Membri ({members.length})</h3>
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

                        {activeSection === "roles" && (
                            <div className="bg-white p-5 rounded shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Ruoli ({rolesCount ?? 0})</h3>
                                    <ActionButton icon={ShieldOff}>Nuovo ruolo</ActionButton>
                                </div>

                                <div className="space-y-2">
                                    {recentRoles.length === 0 ? <div className="text-sm text-gray-500">Nessun ruolo</div> : recentRoles.map((r: any) => (
                                        <div key={r.id} className="p-3 border rounded flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{r.name}</div>
                                                <div className="text-xs text-gray-500">Livello {r.level}</div>
                                            </div>
                                            <div className="text-sm text-gray-600">{r.permissions?.length ?? 0} permessi</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === "files" && (
                            <div className="bg-white p-5 rounded shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">File ({filesCount ?? 0})</h3>
                                    <ActionButton icon={Upload}>Carica file</ActionButton>
                                </div>

                                <div className="space-y-2">
                                    {recentFiles.length === 0 ? <div className="text-sm text-gray-500">Nessun file</div> : recentFiles.map((f: any) => (
                                        <div key={f.id} className="p-3 border rounded flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{f.name}</div>
                                                <div className="text-xs text-gray-500">{f.mimeType} • {f.size ?? "—"} bytes</div>
                                            </div>
                                            <div className="text-sm text-gray-600">{new Date(f.uploadedAt).toLocaleDateString?.()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === "settings" && (
                            <div className="bg-white p-5 rounded shadow">
                                <h3 className="text-lg font-semibold mb-4">Impostazioni lista</h3>
                                <div className="space-y-3">
                                    <button className="px-4 py-2 border rounded text-sm">Permessi avanzati</button>
                                    <button className="px-4 py-2 border rounded text-sm">Integrazioni</button>
                                    <button className="px-4 py-2 border rounded text-sm">Esporta dati</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ListDashboard;