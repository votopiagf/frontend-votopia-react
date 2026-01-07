import React, { useState } from 'react';
import { Users, UserCheck, UsersRound, Plus } from 'lucide-react';

// Hooks
import { useRoles, type RoleUI, type RoleFormData } from '@/hooks/useRoles';

// Components
import { StatCard } from '@/components/ui/Modal';
import { ActionButton } from '@/components/ui/action-button';
import { RoleList, RoleProfileCard } from '@/components/roles/RoleComponents';
import { RoleFormModal, PermissionsModal, DeleteRoleModal } from '@/components/roles/RoleModals';

// ============================================================================
// ROLES SCREEN
// ============================================================================

const RolesScreen: React.FC = () => {
    // Custom hook per gestione ruoli
    const {
        roles,
        filteredRoles,
        selectedRole,
        selectedRoleDetail,
        lists,
        loading,
        actionLoading,
        error,
        selectedRoleId,
        setSelectedRoleId,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        createRole,
        updateRole,
        deleteRole,
    } = useRoles();

    // Modal states
    const [modals, setModals] = useState({
        roleForm: false,
        permissions: false,
        deleteRole: false,
    });

    // Role to act on (for modals)
    const [roleToAct, setRoleToAct] = useState<RoleUI | null>(null);

    // Modal helpers
    const openModal = (modal: keyof typeof modals, role?: RoleUI | null) => {
        if (role !== undefined) setRoleToAct(role);
        setModals(prev => ({ ...prev, [modal]: true }));
    };

    const closeModal = (modal: keyof typeof modals) => {
        setModals(prev => ({ ...prev, [modal]: false }));
        setRoleToAct(null);
    };

    // Action handlers
    const handleCreateRole = () => openModal('roleForm', null);
    const handleEditRole = (role: RoleUI) => openModal('roleForm', role);
    const handleDeleteRole = (role: RoleUI) => openModal('deleteRole', role);
    const handleManagePermissions = (role: RoleUI) => openModal('permissions', role);

    const handleSaveRole = async (id: string | null, data: RoleFormData) => {
        if (id) {
            await updateRole(id, data);
        } else {
            await createRole(data);
        }
        closeModal('roleForm');
    };

    const handleConfirmDelete = async () => {
        if (roleToAct) {
            await deleteRole(roleToAct.id);
            closeModal('deleteRole');
        }
    };

    // Permissions handlers (placeholder - backend dovrebbe gestire)
    const handleAddPermission = async (permissionId: number) => {
        if (roleToAct && selectedRoleDetail) {
            const currentPermIds = selectedRoleDetail.permissions?.map(p => p.id) || [];
            await updateRole(roleToAct.id, {
                permissionsId: [...currentPermIds, permissionId],
            });
        }
    };

    const handleRemovePermission = async (permissionId: number) => {
        if (roleToAct && selectedRoleDetail) {
            const currentPermIds = selectedRoleDetail.permissions?.map(p => p.id) || [];
            await updateRole(roleToAct.id, {
                permissionsId: currentPermIds.filter(id => id !== permissionId),
            });
        }
    };

    // Stats
    const totalRoles = roles.length;
    const orgRoles = roles.filter(r => r.list === null).length;
    const listRoles = roles.filter(r => r.list !== null).length;

    // Get permissions for selected role
    const selectedPermissions = selectedRoleDetail?.permissions || [];

    return (
        <div className="flex h-screen w-full bg-[#EFEFEF] overflow-hidden font-sans">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1600px] mx-auto">

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-5 mb-4">
                            <StatCard
                                value={totalRoles}
                                label="Ruoli totali"
                                icon={Users}
                                bg="bg-white"
                                textCol="#374151"
                            />
                            <StatCard
                                value={orgRoles}
                                label="Ruoli organizzazione"
                                icon={UserCheck}
                                bg="bg-[#d9f99d]"
                                textCol="#285300"
                            />
                            <StatCard
                                value={listRoles}
                                label="Ruoli liste"
                                icon={UsersRound}
                                bg="bg-white"
                                textCol="#374151"
                            />
                        </div>

                        {/* Error banner */}
                        {error && (
                            <div className="mb-4">
                                <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="flex flex-row items-start gap-6">

                            {/* Left Column: Role List */}
                            <RoleList
                                roles={filteredRoles}
                                selectedRoleId={selectedRoleId}
                                loading={loading}
                                searchQuery={searchQuery}
                                filterType={filterType}
                                onSearchChange={setSearchQuery}
                                onFilterChange={setFilterType}
                                onSelectRole={setSelectedRoleId}
                                onEditRole={handleEditRole}
                                onDeleteRole={handleDeleteRole}
                                onManagePermissions={handleManagePermissions}
                                onCreateRole={handleCreateRole}
                            />

                            {/* Right Column: Profile & Actions */}
                            <div className="flex-[2] flex flex-col gap-6">

                                {/* Profile Card */}
                                <RoleProfileCard
                                    role={selectedRole}
                                    permissions={selectedPermissions}
                                    onEdit={() => selectedRole && handleEditRole(selectedRole)}
                                    onManagePermissions={() => selectedRole && handleManagePermissions(selectedRole)}
                                    onDelete={() => selectedRole && handleDeleteRole(selectedRole)}
                                />

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <ActionButton
                                                icon={Plus}
                                                onClick={handleCreateRole}
                                            >
                                                Aggiungi ruolo
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <RoleFormModal
                open={modals.roleForm}
                role={roleToAct}
                lists={lists}
                onCancel={() => closeModal('roleForm')}
                onSave={handleSaveRole}
                loading={actionLoading}
            />

            <DeleteRoleModal
                open={modals.deleteRole}
                role={roleToAct}
                onCancel={() => closeModal('deleteRole')}
                onConfirm={handleConfirmDelete}
                loading={actionLoading}
            />

            <PermissionsModal
                open={modals.permissions}
                role={roleToAct}
                permissions={selectedPermissions}
                onCancel={() => closeModal('permissions')}
                onAddPermission={handleAddPermission}
                onRemovePermission={handleRemovePermission}
                availablePermissions={[]} // TODO: fetch from backend
                loading={actionLoading}
            />
        </div>
    );
};

export default RolesScreen;

