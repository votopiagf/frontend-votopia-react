import React from "react";
import { Edit, Download } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import type { UserDetail } from "@/types/user.types";
import { AppColor } from "@/styles/colors";

interface Props {
    user: UserDetail | null;
    onEdit?: (u: UserDetail) => void;
    onResetPassword?: (u: UserDetail) => void;
}

const UsersDetail: React.FC<Props> = ({ user, onEdit, onResetPassword }) => {
    if (!user) {
        return <div className="bg-white rounded-[20px] shadow-sm p-6 text-gray-400">Seleziona un utente per vedere i dettagli</div>;
    }

    return (
        <div className="bg-white rounded-[20px] shadow-sm p-7">
        <div className="flex items-center gap-4 mb-4">
        <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center" style={{ backgroundColor: AppColor.secondary }}>
    <span className="text-[36px] font-semibold" style={{ color: AppColor.primary }}>
    {`${user.name[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase()}
    </span>
    </div>
    <div>
    <h2 className="text-2xl font-semibold text-gray-900">{user.name} {user.surname}</h2>
    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        <div className="text-xs text-gray-400 mt-2">ID: {user.id}</div>
    </div>
    </div>

    <div className="w-full h-px bg-gray-200 my-4" />

    <div className="mb-4">
    <p className="text-[13px] text-gray-500 font-medium mb-1.5">Ruoli</p>
        <div className="flex flex-wrap gap-2">
        {user.roles.map(r => (
                <span key={r.id} className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: r.color ?? "#f1f5f9", color: r.color ? "#fff" : "#374151" }}>
    {r.name}
    </span>
))}
    </div>
    </div>

    <div className="mb-6">
    <p className="text-[13px] text-gray-500 font-medium mb-1.5">Liste</p>
        <p className="text-sm text-gray-900">{user.lists.map(l => l.name).join(", ") || "—"}</p>
        </div>

        <div className="flex gap-3">
    <ActionButton icon={Edit} variant="secondary" onClick={() => user && onEdit?.(user)}>Modifica utente</ActionButton>
    <ActionButton icon={Download}>Esporta</ActionButton>
        <button
    className="ml-auto px-3 py-2 rounded text-sm border"
    onClick={() => user && onResetPassword?.(user)}
>
    {user.mustChangePassword ? "Forza cambio password" : "Reimposta password"}
    </button>
    </div>
    </div>
);
};

export default UsersDetail;