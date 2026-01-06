import React, { useEffect, useState } from "react";
import { AppColor } from "@/styles/colors";
import type { UserDetail } from "@/types/user.types";
import type { RoleSummary } from "@/types/role.types";
import type { ListSummary } from "@/types/list.types";

/**
 * Modali riutilizzabili aggiornati per UsersDetail (roles: RoleSummary[], lists: ListSummary[])
 */

// Confirm delete
export const ConfirmDeleteModal: React.FC<{
    open: boolean;
    title?: string;
    message: string;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}> = ({ open, title = "Conferma", message, loading = false, onCancel, onConfirm }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[440px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={onCancel} disabled={loading}>Annulla</button>
                    <button className="px-4 py-2 rounded-[8px]" style={{ backgroundColor: AppColor.delete, color: "white" }} onClick={onConfirm} disabled={loading}>
                        {loading ? "Eliminando..." : "Elimina"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Edit user (supports editing roles and lists via comma-separated input by default)
export const EditUserModal: React.FC<{
    open: boolean;
    user: UserDetail | null;
    rolesOptions?: RoleSummary[]; // opzionale per select
    listsOptions?: ListSummary[]; // opzionale per select
    loading?: boolean;
    onCancel: () => void;
    onSave: (u: UserDetail) => void;
}> = ({ open, user, rolesOptions = [], listsOptions = [], loading = false, onCancel, onSave }) => {
    const [form, setForm] = useState<UserDetail | null>(user);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(user ? {...user} : null);
    }, [user]);

    if (!open || !form) return null;

    const toggleRole = (role: RoleSummary) => {
        const exists = form.roles.some(r => r.id === role.id);
        setForm({
            ...form,
            roles: exists ? form.roles.filter(r => r.id !== role.id) : [...form.roles, role]
        });
    };

    const toggleList = (l: ListSummary) => {
        const exists = form.lists.some(x => x.id === l.id);
        setForm({
            ...form,
            lists: exists ? form.lists.filter(x => x.id !== l.id) : [...form.lists, l]
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[640px] max-h-[90vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifica utente</h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-600">Nome</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Cognome</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} />
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600">Email</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600">Ruoli (seleziona)</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {rolesOptions.length === 0 ? <div className="text-sm text-gray-500">Nessuna opzione disponibile</div> : rolesOptions.map(r => {
                                const active = form.roles.some(x => x.id === r.id);
                                return (
                                    <button key={r.id} onClick={() => toggleRole(r)} className={`px-3 py-1 rounded text-sm ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                        {r.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600">Liste (seleziona)</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {listsOptions.length === 0 ? <div className="text-sm text-gray-500">Nessuna opzione disponibile</div> : listsOptions.map(l => {
                                const active = form.lists.some(x => x.id === l.id);
                                return (
                                    <button key={l.id} onClick={() => toggleList(l)} className={`px-3 py-1 rounded text-sm ${active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                        {l.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.mustChangePassword} onChange={(e) => setForm({ ...form, mustChangePassword: e.target.checked })} />
                            Forza cambio password
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.deleted} onChange={(e) => setForm({ ...form, deleted: e.target.checked })} />
                            Segna come eliminato
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={onCancel} disabled={loading}>Annulla</button>
                    <button className="px-4 py-2 rounded-[8px]" style={{ backgroundColor: AppColor.primary, color: "white" }} onClick={() => form && onSave(form)} disabled={loading}>
                        {loading ? "Salvando..." : "Salva"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Register modal (simple form)
export const RegisterUserModal: React.FC<{
    open: boolean;
    loading?: boolean;
    onCancel: () => void;
    onCreate: (u: Omit<UserDetail, "id">) => void;
}> = ({ open, loading = false, onCancel, onCreate }) => {
    const [form, setForm] = useState<Omit<UserDetail, "id">>({
        name: "",
        surname: "",
        email: "",
        roles: [],
        deleted: false,
        mustChangePassword: false,
        lists: []
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { if (!open) setForm({ name: "", surname: "", email: "", roles: [], deleted: false, mustChangePassword: false, lists: [] }); }, [open]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-[12px] shadow-lg p-6 w-[640px] max-h-[90vh] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Registra nuovo utente</h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-600">Nome</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Cognome</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm text-gray-600">Email</label>
                        <input className="w-full mt-1 p-2 border rounded text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button className="px-4 py-2 rounded-[8px] bg-gray-100" onClick={onCancel} disabled={loading}>Annulla</button>
                    <button className="px-4 py-2 rounded-[8px]" style={{ backgroundColor: AppColor.success, color: "white" }} onClick={() => onCreate(form)} disabled={loading || !form.name || !form.email}>
                        {loading ? "Registrando..." : "Registra"}
                    </button>
                </div>
            </div>
        </div>
    );
};