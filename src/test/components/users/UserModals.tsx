import React, { useState, useEffect } from 'react';
import { Modal, ModalActions, FormInput, ConfirmModal, CheckboxListItem } from '@/test/components/ui/Modal.tsx';
import { ActionButton } from '@/test/components/ui/action-button.tsx';
import { Plus, CheckSquare, Square, Search } from 'lucide-react';
import type { UserUI, UserFormData } from '@/test/hooks/useUsers.ts';
import type { ListOptionDto, RoleOptionDto } from '@/test/types/dtos/user.dto.ts';
import { getDisplayName, rolesToString } from '@/test/hooks/useUsers.ts';

// ============================================================================
// EDIT USER MODAL
// ============================================================================

interface EditUserModalProps {
    open: boolean;
    user: UserUI | null;
    onCancel: () => void;
    onSave: (id: string, data: Partial<UserFormData>) => void;
    loading?: boolean;
    availableLists?: ListOptionDto[];
    availableRoles?: RoleOptionDto[];
    onGetRolesForList?: (listId?: number) => Promise<RoleOptionDto[]>;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
    open,
    user,
    onCancel,
    onSave,
    loading = false,
    availableLists = [],
    availableRoles = [],
    onGetRolesForList,
}) => {
    const [form, setForm] = useState({ name: '', surname: '', email: '' });
    const [selectedListIds, setSelectedListIds] = useState<number[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
    const [rolesForLists, setRolesForLists] = useState<RoleOptionDto[]>([]);

    useEffect(() => {
        if (user) {
            const newForm = {
                name: user.name,
                surname: user.surname,
                email: user.email,
            };
            const listIds = user.lists?.map(l => l.id) || [];
            const roleIds = user.roles?.map(r => r.id) || [];
            queueMicrotask(() => {
                setForm(newForm);
                setSelectedListIds(listIds);
                setSelectedRoleIds(roleIds);
            });
        }
    }, [user]);

    // Carica ruoli quando cambiano le liste selezionate
    useEffect(() => {
        const loadRolesForLists = async () => {
            if (selectedListIds.length > 0 && onGetRolesForList) {
                const allRoles = await Promise.all(
                    selectedListIds.map(listId => onGetRolesForList(listId))
                );
                setRolesForLists(allRoles.flat());
            } else {
                setRolesForLists([]);
            }
        };
        loadRolesForLists();
    }, [selectedListIds, onGetRolesForList]);

    if (!user) return null;

    const handleSave = () => {
        onSave(user.id, {
            name: form.name,
            surname: form.surname,
            email: form.email,
            listsId: selectedListIds,
            rolesId: selectedRoleIds,
        });
    };

    const toggleList = (listId: number) => {
        setSelectedListIds(prev =>
            prev.includes(listId)
                ? prev.filter(id => id !== listId)
                : [...prev, listId]
        );
    };

    const toggleRole = (roleId: number) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    // Combina ruoli org e ruoli delle liste
    const allAvailableRoles = [
        ...availableRoles,
        ...rolesForLists.filter(r => !availableRoles.some(ar => ar.id === r.id))
    ];

    return (
        <Modal open={open} onClose={onCancel} title="Modifica utente">
            <div className="space-y-3">
                <FormInput
                    label="Nome"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                />
                <FormInput
                    label="Cognome"
                    value={form.surname}
                    onChange={(v) => setForm({ ...form, surname: v })}
                />
                <FormInput
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                />

                {/* Liste */}
                {availableLists.length > 0 && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Liste
                        </label>
                        <div className="max-h-[150px] overflow-y-auto border rounded p-2 space-y-1">
                            {availableLists.map(list => (
                                <label
                                    key={list.id}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedListIds.includes(list.id)}
                                        onChange={() => toggleList(list.id)}
                                        className="rounded"
                                    />
                                    <span className="text-sm">{list.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ruoli */}
                {allAvailableRoles.length > 0 && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Ruoli
                        </label>
                        <div className="max-h-[150px] overflow-y-auto border rounded p-2 space-y-1">
                            {allAvailableRoles.map(role => (
                                <label
                                    key={role.id}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedRoleIds.includes(role.id)}
                                        onChange={() => toggleRole(role.id)}
                                        className="rounded"
                                    />
                                    <span className="text-sm flex items-center gap-2">
                                        {role.name}
                                        {role.color && (
                                            <span
                                                className="w-3 h-3 rounded"
                                                style={{ backgroundColor: role.color }}
                                            />
                                        )}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ModalActions
                onCancel={onCancel}
                onConfirm={handleSave}
                confirmLabel="Salva"
                confirmVariant="primary"
                loading={loading}
            />
        </Modal>
    );
};

// ============================================================================
// REGISTER USER MODAL
// ============================================================================

interface RegisterUserModalProps {
    open: boolean;
    onCancel: () => void;
    onCreate: (data: UserFormData) => void;
    loading?: boolean;
    availableLists?: ListOptionDto[];
    availableRoles?: RoleOptionDto[];
    onGetRolesForList?: (listId?: number) => Promise<RoleOptionDto[]>;
}

export const RegisterUserModal: React.FC<RegisterUserModalProps> = ({
    open,
    onCancel,
    onCreate,
    loading = false,
    availableLists = [],
    availableRoles = [],
    onGetRolesForList,
}) => {
    const [form, setForm] = useState({ name: '', surname: '', email: '' });
    const [selectedListIds, setSelectedListIds] = useState<number[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
    const [rolesForLists, setRolesForLists] = useState<RoleOptionDto[]>([]);

    useEffect(() => {
        if (!open) {
            queueMicrotask(() => {
                setForm({ name: '', surname: '', email: '' });
                setSelectedListIds([]);
                setSelectedRoleIds([]);
                setRolesForLists([]);
            });
        }
    }, [open]);

    // Carica ruoli quando cambiano le liste selezionate
    useEffect(() => {
        const loadRolesForLists = async () => {
            if (selectedListIds.length > 0 && onGetRolesForList) {
                const allRoles = await Promise.all(
                    selectedListIds.map(listId => onGetRolesForList(listId))
                );
                setRolesForLists(allRoles.flat());
            } else {
                setRolesForLists([]);
            }
        };
        loadRolesForLists();
    }, [selectedListIds, onGetRolesForList]);

    const handleCreate = () => {
        onCreate({
            name: form.name,
            surname: form.surname,
            email: form.email,
            rolesId: selectedRoleIds,
            listsId: selectedListIds,
        });
    };

    const isValid = form.name.trim() && form.email.trim();

    const toggleList = (listId: number) => {
        setSelectedListIds(prev =>
            prev.includes(listId)
                ? prev.filter(id => id !== listId)
                : [...prev, listId]
        );
    };

    const toggleRole = (roleId: number) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    // Combina ruoli org e ruoli delle liste
    const allAvailableRoles = [
        ...availableRoles,
        ...rolesForLists.filter(r => !availableRoles.some(ar => ar.id === r.id))
    ];

    return (
        <Modal open={open} onClose={onCancel} title="Registra nuovo utente">
            <div className="space-y-3">
                <FormInput
                    label="Nome"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    required
                />
                <FormInput
                    label="Cognome"
                    value={form.surname}
                    onChange={(v) => setForm({ ...form, surname: v })}
                />
                <FormInput
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    required
                />

                {/* Liste */}
                {availableLists.length > 0 && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Liste (opzionale)
                        </label>
                        <div className="max-h-[150px] overflow-y-auto border rounded p-2 space-y-1">
                            {availableLists.map(list => (
                                <label
                                    key={list.id}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedListIds.includes(list.id)}
                                        onChange={() => toggleList(list.id)}
                                        className="rounded"
                                    />
                                    <span className="text-sm">{list.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ruoli */}
                {allAvailableRoles.length > 0 && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Ruoli (opzionale)
                        </label>
                        <div className="max-h-[150px] overflow-y-auto border rounded p-2 space-y-1">
                            {allAvailableRoles.map(role => (
                                <label
                                    key={role.id}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedRoleIds.includes(role.id)}
                                        onChange={() => toggleRole(role.id)}
                                        className="rounded"
                                    />
                                    <span className="text-sm flex items-center gap-2">
                                        {role.name}
                                        {role.color && (
                                            <span
                                                className="w-3 h-3 rounded"
                                                style={{ backgroundColor: role.color }}
                                            />
                                        )}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ModalActions
                onCancel={onCancel}
                onConfirm={handleCreate}
                confirmLabel="Registra"
                confirmVariant="success"
                loading={loading}
                disabled={!isValid}
            />
        </Modal>
    );
};

// ============================================================================
// BULK REGISTER MODAL
// ============================================================================

interface BulkRegisterRow {
    name: string;
    surname: string;
    email: string;
}

interface BulkRegisterModalProps {
    open: boolean;
    onCancel: () => void;
    onCreateMany: (data: UserFormData[]) => void;
    loading?: boolean;
    availableLists?: ListOptionDto[];
    availableRoles?: RoleOptionDto[];
    onGetRolesForList?: (listId?: number) => Promise<RoleOptionDto[]>;
}

export const BulkRegisterModal: React.FC<BulkRegisterModalProps> = ({
    open,
    onCancel,
    onCreateMany,
    loading = false,
    availableLists = [],
    availableRoles = [],
    onGetRolesForList,
}) => {
    const emptyRow: BulkRegisterRow = { name: '', surname: '', email: '' };
    const [rows, setRows] = useState<BulkRegisterRow[]>([{ ...emptyRow }]);

    // Stati per liste e ruoli
    const [selectedListIds, setSelectedListIds] = useState<number[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
    const [rolesForLists, setRolesForLists] = useState<RoleOptionDto[]>([]);

    // Stati per ricerca
    const [listSearchQuery, setListSearchQuery] = useState('');
    const [roleSearchQuery, setRoleSearchQuery] = useState('');

    useEffect(() => {
        if (!open) {
            setRows([{ ...emptyRow }]);
            setSelectedListIds([]);
            setSelectedRoleIds([]);
            setRolesForLists([]);
            setListSearchQuery('');
            setRoleSearchQuery('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Carica ruoli quando cambiano le liste selezionate
    useEffect(() => {
        const loadRolesForLists = async () => {
            if (selectedListIds.length > 0 && onGetRolesForList) {
                const allRoles = await Promise.all(
                    selectedListIds.map(listId => onGetRolesForList(listId))
                );
                setRolesForLists(allRoles.flat());
            } else {
                setRolesForLists([]);
            }
        };
        loadRolesForLists();
    }, [selectedListIds, onGetRolesForList]);

    const updateRow = (idx: number, field: keyof BulkRegisterRow, value: string) => {
        setRows(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            return updated;
        });
    };

    const addRow = () => setRows(prev => [...prev, { ...emptyRow }]);

    const removeRow = (idx: number) => {
        if (rows.length > 1) {
            setRows(prev => prev.filter((_, i) => i !== idx));
        }
    };

    const toggleList = (listId: number) => {
        setSelectedListIds(prev =>
            prev.includes(listId)
                ? prev.filter(id => id !== listId)
                : [...prev, listId]
        );
    };

    const toggleRole = (roleId: number) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const validRows = rows.filter(r => r.name.trim() && r.email.trim());

    const handleCreate = () => {
        onCreateMany(validRows.map(r => ({
            name: r.name,
            surname: r.surname,
            email: r.email,
            rolesId: selectedRoleIds,
            listsId: selectedListIds,
        })));
    };

    // Combina ruoli org e ruoli delle liste
    const allAvailableRoles = [
        ...availableRoles,
        ...rolesForLists.filter(r => !availableRoles.some(ar => ar.id === r.id))
    ];

    // Filtra liste per ricerca
    const filteredLists = availableLists.filter(list =>
        list.name.toLowerCase().includes(listSearchQuery.toLowerCase())
    );

    // Filtra ruoli per ricerca
    const filteredRoles = allAvailableRoles.filter(role =>
        role.name.toLowerCase().includes(roleSearchQuery.toLowerCase())
    );

    return (
        <Modal open={open} onClose={onCancel} title="Registra utenti multipli" width="w-[900px]">
            <p className="text-sm text-gray-600 mb-4">
                Aggiungi una riga per ogni utente e seleziona liste/ruoli comuni. Al termine premi Registra.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Sezione Utenti */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-800">Utenti da registrare</h3>
                    <div className="space-y-2 max-h-[350px] overflow-y-auto border rounded p-2">
                        {rows.map((row, idx) => (
                            <div key={idx} className="p-2 border rounded bg-gray-50 space-y-1">
                                <input
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Nome *"
                                    value={row.name}
                                    onChange={(e) => updateRow(idx, 'name', e.target.value)}
                                />
                                <input
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Cognome"
                                    value={row.surname}
                                    onChange={(e) => updateRow(idx, 'surname', e.target.value)}
                                />
                                <div className="flex gap-1">
                                    <input
                                        className="flex-1 p-2 border rounded text-sm"
                                        placeholder="Email *"
                                        value={row.email}
                                        onChange={(e) => updateRow(idx, 'email', e.target.value)}
                                    />
                                    <button
                                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                        onClick={() => removeRow(idx)}
                                        disabled={rows.length === 1}
                                        title="Rimuovi"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addRow}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                        + Aggiungi utente
                    </button>
                </div>

                {/* Sezione Liste e Ruoli */}
                <div className="space-y-3">
                    {/* Liste */}
                    {availableLists.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-800">📋 Liste comuni (opzionale)</h3>
                            <input
                                type="text"
                                placeholder="🔍 Cerca lista..."
                                value={listSearchQuery}
                                onChange={(e) => setListSearchQuery(e.target.value)}
                                className="w-full p-2 border rounded text-sm"
                            />
                            <div className="max-h-[150px] overflow-y-auto border rounded p-2 space-y-1">
                                {filteredLists.length > 0 ? (
                                    filteredLists.map(list => (
                                        <label
                                            key={list.id}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedListIds.includes(list.id)}
                                                onChange={() => toggleList(list.id)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">{list.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500 text-center py-2">Nessuna lista trovata</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Ruoli */}
                    {allAvailableRoles.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-800">👤 Ruoli comuni (opzionale)</h3>
                            <input
                                type="text"
                                placeholder="🔍 Cerca ruolo..."
                                value={roleSearchQuery}
                                onChange={(e) => setRoleSearchQuery(e.target.value)}
                                className="w-full p-2 border rounded text-sm"
                            />
                            <div className="max-h-[150px] overflow-y-auto border rounded p-2 space-y-1">
                                {filteredRoles.length > 0 ? (
                                    filteredRoles.map(role => (
                                        <label
                                            key={role.id}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRoleIds.includes(role.id)}
                                                onChange={() => toggleRole(role.id)}
                                                className="rounded"
                                            />
                                            <span className="text-sm flex items-center gap-2">
                                                {role.name}
                                                {role.color && (
                                                    <span
                                                        className="w-3 h-3 rounded"
                                                        style={{ backgroundColor: role.color }}
                                                    />
                                                )}
                                            </span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500 text-center py-2">Nessun ruolo trovato</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ModalActions
                onCancel={onCancel}
                onConfirm={handleCreate}
                confirmLabel={`Registra ${validRows.length} utente/i`}
                confirmVariant="success"
                loading={loading}
                disabled={validRows.length === 0}
            />
        </Modal>
    );
};

// ============================================================================
// BULK DELETE MODAL
// ============================================================================

interface BulkDeleteModalProps {
    open: boolean;
    users: UserUI[];
    currentUserId?: string | null;
    onCancel: () => void;
    onConfirm: (ids: string[]) => void;
    loading?: boolean;
}

export const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({
    open,
    users,
    currentUserId,
    onCancel,
    onConfirm,
    loading = false,
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    // Filtra utenti: escludi l'utente corrente e applica ricerca
    const filteredUsers = users
        .filter(u => u.id !== currentUserId)
        .filter(u => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                getDisplayName(u).toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
        });

    useEffect(() => {
        if (!open) {
            queueMicrotask(() => {
                setSelectedIds(new Set());
                setSearchQuery('');
                setShowConfirm(false);
            });
        }
    }, [open]);

    const toggle = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const selectAll = () => setSelectedIds(new Set(filteredUsers.map(u => u.id)));
    const clearAll = () => setSelectedIds(new Set());

    const handleDeleteClick = () => {
        if (selectedIds.size > 0) {
            setShowConfirm(true);
        }
    };

    const handleConfirmDelete = () => {
        onConfirm(Array.from(selectedIds));
        setShowConfirm(false);
    };

    // Modal di conferma
    if (showConfirm) {
        return (
            <ConfirmModal
                open={true}
                title="Conferma eliminazione"
                message={`Sei sicuro di voler eliminare ${selectedIds.size} utente/i? Questa azione non è reversibile.`}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmDelete}
                confirmLabel={`Elimina ${selectedIds.size} utente/i`}
                variant="danger"
                loading={loading}
            />
        );
    }

    return (
        <Modal open={open} onClose={onCancel} title="Elimina utenti multipli" width="w-[720px]">
            <p className="text-sm text-gray-600 mb-4">
                Seleziona gli utenti che desideri eliminare.
            </p>

            {/* Search */}
            <div className="mb-4 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cerca per nome o email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
            </div>

            <div className="flex gap-3 mb-3">
                <ActionButton
                    variant="secondary"
                    onClick={selectAll}
                    icon={CheckSquare}
                    className="flex-1"
                >
                    Seleziona tutti
                </ActionButton>
                <ActionButton
                    variant="secondary"
                    onClick={clearAll}
                    icon={Square}
                    className="flex-1"
                >
                    Deseleziona
                </ActionButton>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredUsers.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">Nessun utente trovato</p>
                ) : (
                    filteredUsers.map(user => (
                        <CheckboxListItem
                            key={user.id}
                            id={user.id}
                            title={getDisplayName(user)}
                            subtitle={`${user.email} • ${rolesToString(user.roles)}`}
                            checked={selectedIds.has(user.id)}
                            onChange={toggle}
                        />
                    ))
                )}
            </div>

            <ModalActions
                onCancel={onCancel}
                onConfirm={handleDeleteClick}
                confirmLabel={`Elimina selezionati (${selectedIds.size})`}
                confirmVariant="danger"
                loading={loading}
                disabled={selectedIds.size === 0}
            />
        </Modal>
    );
};

// ============================================================================
// BULK EDIT MODAL
// ============================================================================

interface BulkEditModalProps {
    open: boolean;
    users: UserUI[];
    currentUserId?: string | null;
    onCancel: () => void;
    onConfirm: (ids: string[], data: Partial<UserFormData>) => void;
    loading?: boolean;
    availableLists?: ListOptionDto[];
    availableRoles?: RoleOptionDto[];
    onGetRolesForList?: (listId?: number) => Promise<RoleOptionDto[]>;
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
    open,
    users,
    currentUserId,
    onCancel,
    onConfirm,
    loading = false,
    availableLists = [],
    availableRoles = [],
    onGetRolesForList,
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    // Stati per liste e ruoli
    const [selectedListIds, setSelectedListIds] = useState<number[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
    const [rolesForLists, setRolesForLists] = useState<RoleOptionDto[]>([]);

    // Stati per ricerca
    const [listSearchQuery, setListSearchQuery] = useState('');
    const [roleSearchQuery, setRoleSearchQuery] = useState('');

    // Filtra utenti: escludi l'utente corrente e applica ricerca
    const filteredUsers = users
        .filter(u => u.id !== currentUserId)
        .filter(u => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                getDisplayName(u).toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
        });

    useEffect(() => {
        if (!open) {
            queueMicrotask(() => {
                setSelectedIds(new Set());
                setSearchQuery('');
                setSelectedListIds([]);
                setSelectedRoleIds([]);
                setRolesForLists([]);
                setListSearchQuery('');
                setRoleSearchQuery('');
            });
        }
    }, [open]);

    // Carica ruoli quando cambiano le liste selezionate
    useEffect(() => {
        const loadRolesForLists = async () => {
            if (selectedListIds.length > 0 && onGetRolesForList) {
                const allRoles = await Promise.all(
                    selectedListIds.map(listId => onGetRolesForList(listId))
                );
                setRolesForLists(allRoles.flat());
            } else {
                setRolesForLists([]);
            }
        };
        loadRolesForLists();
    }, [selectedListIds, onGetRolesForList]);

    const toggle = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const selectAll = () => setSelectedIds(new Set(filteredUsers.map(u => u.id)));
    const clearAll = () => setSelectedIds(new Set());

    const toggleList = (listId: number) => {
        setSelectedListIds(prev =>
            prev.includes(listId)
                ? prev.filter(id => id !== listId)
                : [...prev, listId]
        );
    };

    const toggleRole = (roleId: number) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const handleConfirm = () => {
        onConfirm(Array.from(selectedIds), {
            rolesId: selectedRoleIds,
            listsId: selectedListIds
        });
    };

    // Combina ruoli org e ruoli delle liste
    const allAvailableRoles = [
        ...availableRoles,
        ...rolesForLists.filter(r => !availableRoles.some(ar => ar.id === r.id))
    ];

    // Filtra liste per ricerca
    const filteredLists = availableLists.filter(list =>
        list.name.toLowerCase().includes(listSearchQuery.toLowerCase())
    );

    // Filtra ruoli per ricerca
    const filteredRoles = allAvailableRoles.filter(role =>
        role.name.toLowerCase().includes(roleSearchQuery.toLowerCase())
    );

    return (
        <Modal open={open} onClose={onCancel} title="Modifica utenti multipli" width="w-[900px]">
            <p className="text-sm text-gray-600 mb-4">
                Seleziona gli utenti e scegli liste/ruoli da applicare a tutti.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Sezione Selezione Utenti */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-800">Seleziona utenti</h3>

                    {/* Search */}
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cerca per nome o email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded text-sm"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={selectAll}
                            className="flex-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                        >
                            Tutti
                        </button>
                        <button
                            onClick={clearAll}
                            className="flex-1 px-3 py-1.5 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
                        >
                            Nessuno
                        </button>
                    </div>

                    <div className="space-y-1 max-h-[350px] overflow-y-auto border rounded p-2">
                        {filteredUsers.length === 0 ? (
                            <p className="text-xs text-gray-500 text-center py-4">Nessun utente trovato</p>
                        ) : (
                            filteredUsers.map(user => (
                                <label
                                    key={user.id}
                                    className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(user.id)}
                                        onChange={() => toggle(user.id)}
                                        className="rounded mt-0.5"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {getDisplayName(user)}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>
                    <p className="text-xs text-gray-600">
                        Selezionati: <span className="font-semibold">{selectedIds.size}</span>
                    </p>
                </div>

                {/* Sezione Liste e Ruoli */}
                <div className="space-y-3">
                    {/* Liste */}
                    {availableLists.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-800">📋 Liste da assegnare</h3>
                            <input
                                type="text"
                                placeholder="🔍 Cerca lista..."
                                value={listSearchQuery}
                                onChange={(e) => setListSearchQuery(e.target.value)}
                                className="w-full p-2 border rounded text-sm"
                            />
                            <div className="max-h-[150px] overflow-y-auto border rounded p-2 space-y-1">
                                {filteredLists.length > 0 ? (
                                    filteredLists.map(list => (
                                        <label
                                            key={list.id}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedListIds.includes(list.id)}
                                                onChange={() => toggleList(list.id)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">{list.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500 text-center py-2">Nessuna lista trovata</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Ruoli */}
                    {allAvailableRoles.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-800">👤 Ruoli da assegnare</h3>
                            <input
                                type="text"
                                placeholder="🔍 Cerca ruolo..."
                                value={roleSearchQuery}
                                onChange={(e) => setRoleSearchQuery(e.target.value)}
                                className="w-full p-2 border rounded text-sm"
                            />
                            <div className="max-h-[150px] overflow-y-auto border rounded p-2 space-y-1">
                                {filteredRoles.length > 0 ? (
                                    filteredRoles.map(role => (
                                        <label
                                            key={role.id}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRoleIds.includes(role.id)}
                                                onChange={() => toggleRole(role.id)}
                                                className="rounded"
                                            />
                                            <span className="text-sm flex items-center gap-2">
                                                {role.name}
                                                {role.color && (
                                                    <span
                                                        className="w-3 h-3 rounded"
                                                        style={{ backgroundColor: role.color }}
                                                    />
                                                )}
                                            </span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500 text-center py-2">Nessun ruolo trovato</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ModalActions
                onCancel={onCancel}
                onConfirm={handleConfirm}
                confirmLabel={`Modifica ${selectedIds.size} utente/i`}
                confirmVariant="primary"
                loading={loading}
                disabled={selectedIds.size === 0}
            />
        </Modal>
    );
};

// ============================================================================
// DELETE CONFIRM MODAL (wrapper per singola delete)
// ============================================================================

interface DeleteUserModalProps {
    open: boolean;
    user: UserUI | null;
    onCancel: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    open,
    user,
    onCancel,
    onConfirm,
    loading = false,
}) => {
    return (
        <ConfirmModal
            open={open}
            title="Elimina utente"
            message={`Sei sicuro di voler eliminare l'utente "${user ? getDisplayName(user) : ''}"? Questa azione non è reversibile.`}
            onCancel={onCancel}
            onConfirm={onConfirm}
            confirmLabel="Elimina"
            variant="danger"
            loading={loading}
        />
    );
};

// ============================================================================
// RESET PASSWORD MODAL
// ============================================================================

interface ResetPasswordModalProps {
    open: boolean;
    user: UserUI | null;
    onCancel: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
    open,
    user,
    onCancel,
    onConfirm,
    loading = false,
}) => {
    return (
        <ConfirmModal
            open={open}
            title="Reimposta password"
            message={`Sei sicuro di voler reimpostare la password per "${user ? getDisplayName(user) : ''}"? L'utente riceverà una notifica via email.`}
            onCancel={onCancel}
            onConfirm={onConfirm}
            confirmLabel="Reimposta"
            variant="primary"
            loading={loading}
        />
    );
};

