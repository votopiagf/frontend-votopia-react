import React, { useState, useEffect } from 'react';
import { Modal, ModalActions, FormInput, ConfirmModal } from '@/components/ui/Modal';
import { ActionButton } from '@/components/ui/action-button';
import { Plus } from 'lucide-react';
import type { RoleUI, RoleFormData } from '@/hooks/useRoles';
import type { ListSummary } from '@/types/list.types';

// ============================================================================
// ROLE FORM MODAL (Create/Edit)
// ============================================================================

interface RoleFormModalProps {
    open: boolean;
    role: RoleUI | null; // null = create
    lists: ListSummary[];
    onCancel: () => void;
    onSave: (id: string | null, data: RoleFormData) => void;
    loading?: boolean;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
    open,
    role,
    lists,
    onCancel,
    onSave,
    loading = false,
}) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#336900');
    const [level, setLevel] = useState(0);
    const [listId, setListId] = useState<number | 'org'>('org');

    useEffect(() => {
        if (open) {
            if (role) {
                queueMicrotask(() => {
                    setName(role.name);
                    setColor(role.color);
                    setLevel(role.level);
                    setListId(role.list ? role.list.id : 'org');
                });
            } else {
                queueMicrotask(() => {
                    setName('');
                    setColor('#336900');
                    setLevel(0);
                    setListId('org');
                });
            }
        }
    }, [open, role]);

    const handleSave = () => {
        onSave(role?.id ?? null, {
            name,
            color,
            level,
            listId: listId === 'org' ? undefined : listId,
        });
    };

    const isValid = name.trim().length > 0;

    return (
        <Modal
            open={open}
            onClose={onCancel}
            title={role ? 'Modifica ruolo' : 'Nuovo ruolo'}
            width="w-[600px]"
        >
            <div className="grid grid-cols-2 gap-4">
                <FormInput
                    label="Nome"
                    value={name}
                    onChange={setName}
                    required
                />
                <div>
                    <label className="text-sm text-gray-600">Colore</label>
                    <div className="flex gap-2 mt-1">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-12 h-10 border rounded cursor-pointer"
                        />
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="flex-1 p-2 border rounded text-sm"
                            placeholder="#336900"
                        />
                    </div>
                </div>
                <FormInput
                    label="Livello"
                    value={String(level)}
                    onChange={(v) => setLevel(Number(v) || 0)}
                    type="text"
                />
                <div>
                    <label className="text-sm text-gray-600">Tipologia</label>
                    <select
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={listId}
                        onChange={(e) => setListId(e.target.value === 'org' ? 'org' : Number(e.target.value))}
                    >
                        <option value="org">Ruolo di organizzazione</option>
                        <optgroup label="Ruoli delle liste">
                            {lists.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>
            </div>

            <ModalActions
                onCancel={onCancel}
                onConfirm={handleSave}
                confirmLabel={role ? 'Salva' : 'Crea'}
                confirmVariant="primary"
                loading={loading}
                disabled={!isValid}
            />
        </Modal>
    );
};

// ============================================================================
// PERMISSIONS MODAL
// ============================================================================

interface Permission {
    id: number;
    name: string;
    description?: string;
}

interface PermissionsModalProps {
    open: boolean;
    role: RoleUI | null;
    permissions: Permission[];
    onCancel: () => void;
    onAddPermission: (permissionId: number) => void;
    onRemovePermission: (permissionId: number) => void;
    availablePermissions?: Permission[];
    loading?: boolean;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
    open,
    role,
    permissions,
    onCancel,
    onAddPermission,
    onRemovePermission,
    availablePermissions = [],
    loading = false,
}) => {
    const [selectedPermId, setSelectedPermId] = useState<number | ''>('');

    useEffect(() => {
        if (!open) {
            queueMicrotask(() => setSelectedPermId(''));
        }
    }, [open]);

    if (!role) return null;

    const handleAdd = () => {
        if (selectedPermId !== '') {
            onAddPermission(selectedPermId);
            setSelectedPermId('');
        }
    };

    // Filter out already assigned permissions
    const unassignedPermissions = availablePermissions.filter(
        p => !permissions.some(rp => rp.id === p.id)
    );

    return (
        <Modal
            open={open}
            onClose={onCancel}
            title={`Gestisci permessi: ${role.name}`}
            width="w-[640px]"
        >
            {/* Add permission */}
            {unassignedPermissions.length > 0 && (
                <div className="flex gap-2 mb-4">
                    <select
                        className="flex-1 p-2 border rounded text-sm"
                        value={selectedPermId}
                        onChange={(e) => setSelectedPermId(e.target.value ? Number(e.target.value) : '')}
                    >
                        <option value="">Seleziona permesso...</option>
                        {unassignedPermissions.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <ActionButton
                        icon={Plus}
                        onClick={handleAdd}
                        disabled={selectedPermId === '' || loading}
                        className="max-w-[150px]"
                    >
                        Aggiungi
                    </ActionButton>
                </div>
            )}

            {/* Permissions list */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {permissions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        Nessun permesso assegnato
                    </p>
                ) : (
                    permissions.map(p => (
                        <div
                            key={p.id}
                            className="flex items-center justify-between p-3 border rounded"
                        >
                            <div>
                                <div className="font-medium text-gray-900">{p.name}</div>
                                {p.description && (
                                    <div className="text-xs text-gray-500">{p.description}</div>
                                )}
                            </div>
                            <ActionButton
                                variant="destructive"
                                onClick={() => onRemovePermission(p.id)}
                                disabled={loading}
                                className="max-w-[100px] py-2"
                            >
                                Rimuovi
                            </ActionButton>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-end mt-4">
                <ActionButton
                    variant="secondary"
                    onClick={onCancel}
                    className="max-w-[150px]"
                >
                    Chiudi
                </ActionButton>
            </div>
        </Modal>
    );
};

// ============================================================================
// DELETE ROLE MODAL
// ============================================================================

interface DeleteRoleModalProps {
    open: boolean;
    role: RoleUI | null;
    onCancel: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
    open,
    role,
    onCancel,
    onConfirm,
    loading = false,
}) => {
    return (
        <ConfirmModal
            open={open}
            title="Elimina ruolo"
            message={`Sei sicuro di voler eliminare il ruolo "${role?.name ?? ''}"? Questa azione scollegherà tutti gli utenti associati a questo ruolo.`}
            onCancel={onCancel}
            onConfirm={onConfirm}
            confirmLabel="Elimina"
            variant="danger"
            loading={loading}
        />
    );
};

