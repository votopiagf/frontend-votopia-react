import React, { useState } from 'react';
import { Search, ChevronDown, Edit, Trash2, X } from 'lucide-react';
import type { UserUI } from '@/test/hooks/useUsers.ts';
import type { ListOptionDto, RoleOptionDto } from '@/test/types/dtos/user.dto.ts';
import { getDisplayName, getInitials, rolesToString, listsToString } from '@/test/hooks/useUsers.ts';
import { AppColor } from '@/test/styles/colors.ts';
import { ActionButton } from '@/test/components/ui/action-button.tsx';

// ============================================================================
// USER LIST ITEM
// ============================================================================

interface UserListItemProps {
    user: UserUI;
    isSelected: boolean;
    isLast: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const UserListItem: React.FC<UserListItemProps> = ({
    user,
    isSelected,
    isLast,
    onSelect,
    onEdit,
    onDelete,
}) => {
    return (
        <div
            onClick={onSelect}
            className={`
                px-6 py-4 border-b border-gray-100 flex items-center cursor-pointer 
                transition-colors hover:bg-gray-50
                ${isLast ? 'border-b-0' : ''}
                ${isSelected ? 'bg-blue-50/50' : ''}
            `}
        >
            <div className="flex-1">
                <h4 className="text-[17px] font-semibold text-gray-900">
                    {getDisplayName(user)}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                <div className="mt-2 flex gap-1 flex-wrap">
                    {user.roles.map(role => (
                        <span
                            key={role.id}
                            className="px-2.5 py-1 rounded-md text-xs"
                            style={{
                                backgroundColor: role.color ? `${role.color}20` : '#e5e7eb',
                                color: role.color || '#374151',
                            }}
                        >
                            {role.name}
                        </span>
                    ))}
                    {user.roles.length === 0 && (
                        <span className="px-2.5 py-1 bg-gray-200 rounded-md text-xs text-gray-700">
                            Nessun ruolo
                        </span>
                    )}
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
// USER LIST
// ============================================================================

interface UserListProps {
    users: UserUI[];
    selectedUserId: string | null;
    loading: boolean;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    onSelectUser: (id: string) => void;
    onEditUser: (user: UserUI) => void;
    onDeleteUser: (user: UserUI) => void;
    // Filtri
    availableRoles?: RoleOptionDto[];
    availableLists?: ListOptionDto[];
    selectedRoleId?: number | null;
    selectedListId?: number | null;
    onRoleFilterChange?: (roleId: number | null) => void;
    onListFilterChange?: (listId: number | null) => void;
}

export const UserList: React.FC<UserListProps> = ({
    users,
    selectedUserId,
    loading,
    searchQuery,
    onSearchChange,
    onSelectUser,
    onEditUser,
    onDeleteUser,
    availableRoles = [],
    availableLists = [],
    selectedRoleId = null,
    selectedListId = null,
    onRoleFilterChange,
    onListFilterChange,
}) => {
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [showListDropdown, setShowListDropdown] = useState(false);

    const selectedRole = availableRoles.find(r => r.id === selectedRoleId);
    const selectedList = availableLists.find(l => l.id === selectedListId);

    return (
        <div className="flex-[2] flex flex-col gap-4">
            {/* Filters */}
            <div className="p-5 bg-white rounded-[20px] shadow-sm flex gap-4 items-center">
                <div className="flex-1 h-[45px] bg-[#F8F9FA] rounded-[10px] flex items-center px-4">
                    <Search size={18} className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Cerca per nome, email ..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
                    />
                </div>

                {/* Role Filter */}
                <div className="flex-1 relative">
                    <div
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                        className="h-[45px] px-4 bg-[#F8F9FA] border border-gray-300 rounded-[10px] flex items-center justify-between cursor-pointer hover:border-gray-400 transition"
                    >
                        <span className="text-gray-800 text-[15px]">
                            {selectedRole ? selectedRole.name : 'Tutti i ruoli'}
                        </span>
                        <div className="flex items-center gap-2">
                            {selectedRoleId && onRoleFilterChange && (
                                <X
                                    size={16}
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRoleFilterChange(null);
                                    }}
                                />
                            )}
                            <ChevronDown size={18} className="text-gray-600" />
                        </div>
                    </div>
                    {showRoleDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowRoleDropdown(false)}
                            />
                            <div className="absolute top-[50px] left-0 right-0 bg-white border border-gray-200 rounded-[10px] shadow-lg z-20 max-h-[300px] overflow-y-auto">
                                <div
                                    onClick={() => {
                                        onRoleFilterChange?.(null);
                                        setShowRoleDropdown(false);
                                    }}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                                >
                                    Tutti i ruoli
                                </div>
                                {availableRoles && availableRoles.length > 0 ? (
                                    availableRoles.map((role) => (
                                        <div
                                            key={role.id}
                                            onClick={() => {
                                                onRoleFilterChange?.(role.id);
                                                setShowRoleDropdown(false);
                                            }}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm flex items-center justify-between"
                                        >
                                            <span>{role.name}</span>
                                            {role.color && (
                                                <span
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: role.color }}
                                                />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                        Nessun ruolo disponibile
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* List Filter */}
                <div className="flex-1 relative">
                    <div
                        onClick={() => setShowListDropdown(!showListDropdown)}
                        className="h-[45px] px-4 bg-[#F8F9FA] border border-gray-300 rounded-[10px] flex items-center justify-between cursor-pointer hover:border-gray-400 transition"
                    >
                        <span className="text-gray-800 text-[15px]">
                            {selectedList ? selectedList.name : 'Tutte le liste'}
                        </span>
                        <div className="flex items-center gap-2">
                            {selectedListId && onListFilterChange && (
                                <X
                                    size={16}
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onListFilterChange(null);
                                    }}
                                />
                            )}
                            <ChevronDown size={18} className="text-gray-600" />
                        </div>
                    </div>
                    {showListDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowListDropdown(false)}
                            />
                            <div className="absolute top-[50px] left-0 right-0 bg-white border border-gray-200 rounded-[10px] shadow-lg z-20 max-h-[300px] overflow-y-auto">
                                <div
                                    onClick={() => {
                                        onListFilterChange?.(null);
                                        setShowListDropdown(false);
                                    }}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                                >
                                    Tutte le liste
                                </div>
                                {availableLists && availableLists.length > 0 ? (
                                    availableLists.map((list) => (
                                        <div
                                            key={list.id}
                                            onClick={() => {
                                                onListFilterChange?.(list.id);
                                                setShowListDropdown(false);
                                            }}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
                                        >
                                            {list.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                        Nessuna lista disponibile
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-[20px] shadow-sm pb-6 min-h-[400px]">
                <div className="p-6 pb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Utenti registrati
                        {!loading && users.length > 0 && <span className="text-gray-500 text-sm ml-2">({users.length})</span>}
                    </h3>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-gray-500">Caricamento utenti...</div>
                ) : users.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        {selectedListId ? 'Nessun utente in questa lista' : 'Nessun utente trovato'}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {users.map((user, idx) => (
                            <UserListItem
                                key={user.id}
                                user={user}
                                isSelected={selectedUserId === user.id}
                                isLast={idx === users.length - 1}
                                onSelect={() => onSelectUser(user.id)}
                                onEdit={() => onEditUser(user)}
                                onDelete={() => onDeleteUser(user)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// USER PROFILE CARD
// ============================================================================

interface UserProfileCardProps {
    user: UserUI | null;
    onEdit: () => void;
    onResetPassword: () => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
    user,
    onEdit,
    onResetPassword,
}) => {
    if (!user) {
        return (
            <div className="p-7 bg-white rounded-[20px] shadow-sm flex flex-col items-center">
                <div className="text-gray-400 py-10">Nessun utente selezionato</div>
            </div>
        );
    }

    return (
        <div className="p-7 bg-white rounded-[20px] shadow-sm flex flex-col items-center">
            {/* Avatar */}
            <div
                className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: AppColor.secondary }}
            >
                <span className="text-[40px] font-semibold text-[#336900]">
                    {getInitials(user)}
                </span>
            </div>

            {/* Name & Role */}
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
                {getDisplayName(user)}
            </h2>
            <p className="text-[15px] text-gray-500 mt-2 text-center">
                {rolesToString(user.roles) || 'Nessun ruolo'}
            </p>

            <div className="w-full h-px bg-gray-200 my-6" />

            {/* Email */}
            <div className="w-full mb-4">
                <p className="text-[13px] text-gray-500 font-medium mb-1.5">E-mail</p>
                <p className="text-sm text-gray-900">{user.email}</p>
            </div>

            <div className="w-full h-px bg-gray-200 mb-4" />

            {/* Lists */}
            <div className="w-full mb-6">
                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Liste</p>
                <p className="text-sm text-gray-900">
                    {listsToString(user.lists) || 'Nessuna lista'}
                </p>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col gap-3">
                <ActionButton icon={Edit} variant="secondary" onClick={onEdit}>
                    Modifica utente
                </ActionButton>
                <button
                    className="w-full py-3.5 border border-[#1e3a8a] text-[#1e3a8a] rounded-[10px] font-medium hover:bg-blue-50 transition-colors"
                    onClick={onResetPassword}
                >
                    Reimposta password
                </button>
            </div>
        </div>
    );
};

