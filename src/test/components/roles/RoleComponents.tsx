import React from 'react';
import { Search, Edit, Trash2, ShieldCheck } from 'lucide-react';
import type { RoleUI } from '@/test/hooks/useRoles.ts';
import { getRoleTypeLabel } from '@/test/hooks/useRoles.ts';
import { AppColor } from '@/test/styles/colors.ts';
import { ActionButton } from '@/test/components/ui/action-button.tsx';

// ============================================================================
// ROLE LIST ITEM
// ============================================================================

interface RoleListItemProps {
    role: RoleUI;
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onManagePermissions: () => void;
}

export const RoleListItem: React.FC<RoleListItemProps> = ({
    role,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
    onManagePermissions,
}) => {
    return (
        <div
            onClick={onSelect}
            className={`
                px-6 py-4 border-b border-gray-100 flex items-center cursor-pointer 
                transition-colors hover:bg-gray-50
                ${isSelected ? 'bg-blue-50/50' : ''}
            `}
        >
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: role.color }}
                    >
                        <span className="text-white text-sm font-semibold">
                            {role.initials}
                        </span>
                    </div>
                    <div>
                        <h4 className="text-[17px] font-semibold text-gray-900">
                            {role.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                            {getRoleTypeLabel(role)} • Livello {role.level}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    className="p-2 bg-[#336900] text-white rounded-[8px] hover:bg-[#285300] transition"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    title="Modifica"
                >
                    <Edit size={16} />
                </button>
                <button
                    className="p-2 bg-blue-600 text-white rounded-[8px] hover:bg-blue-700 transition"
                    onClick={(e) => { e.stopPropagation(); onManagePermissions(); }}
                    title="Permessi"
                >
                    <ShieldCheck size={16} />
                </button>
                <button
                    className="p-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    title="Elimina"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

// ============================================================================
// ROLE LIST
// ============================================================================

interface RoleListProps {
    roles: RoleUI[];
    selectedRoleId: string | null;
    loading: boolean;
    searchQuery: string;
    filterType: 'all' | 'org' | 'list';
    onSearchChange: (q: string) => void;
    onFilterChange: (type: 'all' | 'org' | 'list') => void;
    onSelectRole: (id: string) => void;
    onEditRole: (role: RoleUI) => void;
    onDeleteRole: (role: RoleUI) => void;
    onManagePermissions: (role: RoleUI) => void;
    onCreateRole: () => void;
}

export const RoleList: React.FC<RoleListProps> = ({
    roles,
    selectedRoleId,
    loading,
    searchQuery,
    filterType,
    onSearchChange,
    onFilterChange,
    onSelectRole,
    onEditRole,
    onDeleteRole,
    onManagePermissions,
    onCreateRole,
}) => {
    const filterButtons: { value: 'all' | 'org' | 'list'; label: string }[] = [
        { value: 'all', label: 'Tutti' },
        { value: 'org', label: 'Organizzazione' },
        { value: 'list', label: 'Liste' },
    ];

    return (
        <div className="flex-[2] flex flex-col gap-4">
            {/* Filters */}
            <div className="p-5 bg-white rounded-[20px] shadow-sm flex gap-4 items-center">
                <div className="flex-1 h-[45px] bg-[#F8F9FA] rounded-[10px] flex items-center px-4">
                    <Search size={18} className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Cerca per nome, lista..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {filterButtons.map(btn => (
                        <button
                            key={btn.value}
                            className={`px-3 py-2 rounded text-sm transition-colors ${
                                filterType === btn.value
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'hover:bg-gray-100'
                            }`}
                            onClick={() => onFilterChange(btn.value)}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Roles List */}
            <div className="bg-white rounded-[20px] shadow-sm pb-6 min-h-[400px]">
                <div className="p-6 pb-2 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Ruoli</h3>
                    <ActionButton onClick={onCreateRole} className="max-w-[180px]">
                        Nuovo ruolo
                    </ActionButton>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-gray-500">Caricamento...</div>
                ) : roles.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">Nessun ruolo trovato</div>
                ) : (
                    <div className="flex flex-col">
                        {roles.map(role => (
                            <RoleListItem
                                key={role.id}
                                role={role}
                                isSelected={selectedRoleId === role.id}
                                onSelect={() => onSelectRole(role.id)}
                                onEdit={() => onEditRole(role)}
                                onDelete={() => onDeleteRole(role)}
                                onManagePermissions={() => onManagePermissions(role)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// ROLE PROFILE CARD
// ============================================================================

interface Permission {
    id: number;
    name: string;
}

interface RoleProfileCardProps {
    role: RoleUI | null;
    permissions: Permission[];
    onEdit: () => void;
    onManagePermissions: () => void;
    onDelete: () => void;
}

export const RoleProfileCard: React.FC<RoleProfileCardProps> = ({
    role,
    permissions,
    onEdit,
    onManagePermissions,
    onDelete,
}) => {
    if (!role) {
        return (
            <div className="p-7 bg-white rounded-[20px] shadow-sm flex flex-col items-center">
                <div className="text-gray-400 py-10">Nessun ruolo selezionato</div>
            </div>
        );
    }

    return (
        <div className="p-7 bg-white rounded-[20px] shadow-sm flex flex-col items-center">
            {/* Avatar */}
            <div
                className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: role.color || AppColor.secondary }}
            >
                <span className="text-[40px] font-semibold text-white">
                    {role.initials}
                </span>
            </div>

            {/* Name & Type */}
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
                {role.name}
            </h2>
            <p className="text-[15px] text-gray-500 mt-2 text-center">
                {getRoleTypeLabel(role)}
            </p>

            <div className="w-full h-px bg-gray-200 my-6" />

            {/* Level */}
            <div className="w-full mb-4">
                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Livello</p>
                <p className="text-sm text-gray-900">{role.level}</p>
            </div>

            <div className="w-full h-px bg-gray-200 mb-4" />

            {/* Permissions */}
            <div className="w-full mb-6">
                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Permessi</p>
                <div className="flex flex-col gap-1">
                    {permissions.length === 0 ? (
                        <p className="text-sm text-gray-500">Nessun permesso assegnato</p>
                    ) : (
                        permissions.map(p => (
                            <span
                                key={p.id}
                                className="text-sm text-gray-800 px-2 py-1 bg-gray-100 rounded inline-block"
                            >
                                {p.name}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col gap-3">
                <ActionButton icon={Edit} variant="secondary" onClick={onEdit}>
                    Modifica ruolo
                </ActionButton>
                <ActionButton icon={ShieldCheck} onClick={onManagePermissions}>
                    Gestisci permessi
                </ActionButton>
                <ActionButton variant="destructive" icon={Trash2} onClick={onDelete}>
                    Elimina ruolo
                </ActionButton>
            </div>
        </div>
    );
};

