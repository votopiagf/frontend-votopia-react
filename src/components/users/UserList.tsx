import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { AppColor } from "@/styles/colors";
import { ActionButton } from "@/components/ui/action-button";
import type { UserDetail } from "@/types/user.types";

interface Props {
    users: UserDetail[];
    loading?: boolean;
    selectedId?: number | null;
    onSelect?: (index: number) => void;
    onEdit?: (u: UserDetail) => void;
    onDelete?: (u: UserDetail) => void;
    onEnter?: (u: UserDetail) => void; // opzionale per entrare nella lista/user menu
}

const UserList: React.FC<Props> = ({ users, loading = false, selectedId = null, onSelect, onEdit, onDelete, onEnter }) => {
    if (loading) return <div className="p-10 text-center text-gray-500">Caricamento...</div>;
    if (users.length === 0) return <div className="p-10 text-center text-gray-500">Nessun utente trovato</div>;

    return (
        <div className="bg-white rounded-[20px] shadow-sm pb-6">
        <div className="p-6 pb-2">
        <h3 className="text-xl font-semibold text-gray-800">Utenti registrati</h3>
    </div>

    <div className="overflow-x-auto">
    <table className="w-full text-left">
    <thead>
        <tr className="text-sm text-gray-500 border-b">
    <th className="py-2 w-[48px]"> </th>
        <th className="py-2">Nome</th>
        <th className="py-2">Email</th>
        <th className="py-2">Ruoli</th>
        <th className="py-2">Liste</th>
        <th className="py-2">Azioni</th>
        </tr>
        </thead>
        <tbody>
        {users.map((u, idx) => {
                    const isSelected = selectedId === u.id;
                    return (
                        <tr
                            key={u.id}
                    className={`border-b hover:bg-gray-50 cursor-pointer ${isSelected ? "bg-blue-50/50" : ""} ${u.deleted ? "opacity-60" : ""}`}
                    onClick={() => onSelect?.(idx)}
                >
                    <td className="py-3 pl-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: AppColor.secondary, color: AppColor.primary }}
                >
                    {`${u.name[0] ?? ""}${u.surname?.[0] ?? ""}`.toUpperCase()}
                    </div>
                    </td>
                    <td className="py-3">
                    <div className="flex flex-col">
                    <div className="font-semibold">{u.name} {u.surname}</div>
                    <div className="text-xs text-gray-400">ID: {u.id} {u.deleted && <span className="ml-2 text-xs text-red-600 font-medium">Eliminato</span>}</div>
                        </div>
                        </td>
                        <td className="py-3 text-sm text-gray-700">{u.email}</td>
                        <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                        {u.roles.map(r => (
                                <span key={r.id} className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: r.color ?? "#f1f5f9", color: r.color ? "#fff" : "#374151" }}>
                        {r.name}
                        </span>
                    ))}
                        </div>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                            {u.lists.map(l => l.name).join(", ")}
                            </td>
                            <td className="py-3">
                        <div className="flex items-center gap-2">
                        <ActionButton icon={Edit} variant="secondary" onClick={(e) => { e.stopPropagation(); onEdit?.(u); }}>
                        Modifica
                        </ActionButton>
                        <ActionButton icon={Trash2} variant="destructive" onClick={(e) => { e.stopPropagation(); onDelete?.(u); }}>
                        Elimina
                        </ActionButton>
                        {onEnter && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEnter(u); }}
                            className="ml-2 px-3 py-1 rounded bg-blue-600 text-white text-sm"
                                >
                                Entra
                                </button>
                        )}
                        </div>
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
                </div>
                </div>
);
};

    export default UserList;