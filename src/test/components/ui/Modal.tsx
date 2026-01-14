import React from 'react';
import { ActionButton } from '@/test/components/ui/action-button.tsx';
import { X } from 'lucide-react';

// ============================================================================
// MODAL BASE - Componente riutilizzabile per tutti i modal
// ============================================================================

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
    maxHeight?: string;
}

export const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    title,
    children,
    width = 'w-[520px]',
    maxHeight = 'max-h-[80vh]',
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />
            <div className={`relative bg-white rounded-[12px] shadow-lg p-6 ${width} ${maxHeight} overflow-auto`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
};

// ============================================================================
// MODAL ACTIONS - Footer standard per modal con ActionButton
// ============================================================================

interface ModalActionsProps {
    onCancel: () => void;
    onConfirm: () => void;
    cancelLabel?: string;
    confirmLabel?: string;
    confirmVariant?: 'primary' | 'danger' | 'success';
    loading?: boolean;
    disabled?: boolean;
}

export const ModalActions: React.FC<ModalActionsProps> = ({
    onCancel,
    onConfirm,
    cancelLabel = 'Annulla',
    confirmLabel = 'Conferma',
    confirmVariant = 'primary',
    loading = false,
    disabled = false,
}) => {
    // Mappa variant del modal a variant di ActionButton
    const actionButtonVariant = confirmVariant === 'danger' ? 'destructive' : confirmVariant === 'success' ? 'primary' : 'primary';

    return (
        <div className="flex justify-end gap-3 mt-5">
            <ActionButton
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
                icon={X}
                className="flex-1 max-w-[180px]"
            >
                {cancelLabel}
            </ActionButton>
            <ActionButton
                variant={actionButtonVariant}
                onClick={onConfirm}
                disabled={loading || disabled}
                isLoading={loading}
                className="flex-1 max-w-[220px]"
            >
                {confirmLabel}
            </ActionButton>
        </div>
    );
};

// ============================================================================
// CONFIRM MODAL - Per conferme semplici (delete, reset, etc.)
// ============================================================================

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'primary' | 'danger' | 'success';
    loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    open,
    title = 'Conferma',
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Conferma',
    cancelLabel = 'Annulla',
    variant = 'danger',
    loading = false,
}) => {
    return (
        <Modal open={open} onClose={onCancel} title={title} width="w-[480px]">
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <ModalActions
                onCancel={onCancel}
                onConfirm={onConfirm}
                cancelLabel={cancelLabel}
                confirmLabel={confirmLabel}
                confirmVariant={variant}
                loading={loading}
            />
        </Modal>
    );
};

// ============================================================================
// FORM INPUT - Input riutilizzabile con label
// ============================================================================

interface FormInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'password';
    disabled?: boolean;
    required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    disabled = false,
    required = false,
}) => {
    return (
        <div>
            <label className="text-sm text-gray-600">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                className="w-full mt-1 p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
            />
        </div>
    );
};

// ============================================================================
// STAT CARD - Card per statistiche
// ============================================================================

interface StatCardProps {
    value: string | number;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    bg?: string;
    textCol?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    value,
    label,
    icon: Icon,
    bg = 'bg-white',
    textCol = '#374151',
}) => {
    const isWhite = bg === 'bg-white';

    return (
        <div className={`p-6 rounded-[20px] shadow-lg flex justify-between items-center ${bg}`}>
            <div className="flex flex-col">
                <span
                    className="text-sm font-extrabold mb-2"
                    style={{ color: isWhite ? '#4b5563' : textCol }}
                >
                    {label}
                </span>
                <span
                    className="text-5xl font-bold leading-none tracking-tighter"
                    style={{ color: textCol }}
                >
                    {value}
                </span>
            </div>
            <div className={`p-4 rounded-full ${isWhite ? 'bg-gray-100' : 'bg-white/20'}`}>
                <Icon
                    className="w-8 h-8"
                    style={{ color: isWhite ? '#4b5563' : textCol }}
                />
            </div>
        </div>
    );
};

// ============================================================================
// CHECKBOX LIST ITEM - Item selezionabile per liste
// ============================================================================

interface CheckboxListItemProps {
    id: string;
    title: string;
    subtitle?: string;
    checked: boolean;
    onChange: (id: string) => void;
}

export const CheckboxListItem: React.FC<CheckboxListItemProps> = ({
    id,
    title,
    subtitle,
    checked,
    onChange,
}) => {
    return (
        <label className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors">
            <div>
                <div className="font-medium text-gray-900">{title}</div>
                {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
            </div>
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange(id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
        </label>
    );
};

