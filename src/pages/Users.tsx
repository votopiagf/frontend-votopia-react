import React, { useState } from 'react';
import { Users, UserCheck, UsersRound, Download, UserPlus, Trash2, Edit } from 'lucide-react';

// Hooks
import { useUsers, type UserUI, type UserFormData } from '@/hooks/useUsers';

// Components
import { StatCard } from '@/components/ui/Modal';
import { ActionButton } from '@/components/ui/action-button';
import { UserList, UserProfileCard } from '@/components/users/UserComponents';
import {
    EditUserModal,
    RegisterUserModal,
    BulkRegisterModal,
    BulkDeleteModal,
    BulkEditModal,
    DeleteUserModal,
    ResetPasswordModal,
} from '@/components/users/UserModals';

// ============================================================================
// USERS SCREEN
// ============================================================================

const UsersScreen: React.FC = () => {
    // Custom hook per gestione utenti
    const {
        users,
        filteredUsers,
        selectedUser,
        loading,
        actionLoading,
        screenInitData,
        availableLists,
        availableOrgRoles,
        selectedUserId,
        setSelectedUserId,
        searchQuery,
        setSearchQuery,
        selectedRoleId,
        setSelectedRoleId,
        selectedListId,
        setSelectedListId,
        createUser,
        createUsers,
        updateUser,
        updateUsers,
        deleteUser,
        deleteUsers,
        resetPassword,
        downloadExcel,
        getAssignableRolesForList,
    } = useUsers();

    // Modal states
    const [modals, setModals] = useState({
        editUser: false,
        deleteUser: false,
        resetPassword: false,
        registerUser: false,
        bulkRegister: false,
        bulkDelete: false,
        bulkEdit: false,
    });

    // User to act on (for single user modals)
    const [userToAct, setUserToAct] = useState<UserUI | null>(null);

    // Modal helpers
    const openModal = (modal: keyof typeof modals, user?: UserUI) => {
        if (user) setUserToAct(user);
        setModals(prev => ({ ...prev, [modal]: true }));
    };

    const closeModal = (modal: keyof typeof modals) => {
        setModals(prev => ({ ...prev, [modal]: false }));
        if (['editUser', 'deleteUser', 'resetPassword'].includes(modal)) {
            setUserToAct(null);
        }
    };

    // Action handlers
    const handleEditUser = (user: UserUI) => openModal('editUser', user);
    const handleDeleteUser = (user: UserUI) => openModal('deleteUser', user);

    const handleSaveEdit = async (id: string, data: Partial<UserFormData>) => {
        await updateUser(id, data);
        closeModal('editUser');
    };

    const handleConfirmDelete = async () => {
        if (userToAct) {
            await deleteUser(userToAct.id);
            closeModal('deleteUser');
        }
    };

    const handleConfirmResetPassword = async () => {
        if (selectedUser) {
            await resetPassword(selectedUser.id);
            closeModal('resetPassword');
        }
    };

    const handleRegisterUser = async (data: UserFormData) => {
        await createUser(data);
        closeModal('registerUser');
    };

    const handleBulkRegister = async (dataList: UserFormData[]) => {
        await createUsers(dataList);
        closeModal('bulkRegister');
    };

    const handleBulkDelete = async (ids: string[]) => {
        await deleteUsers(ids);
        closeModal('bulkDelete');
    };

    const handleBulkEdit = async (ids: string[], data: Partial<UserFormData>) => {
        const updates = ids.map(id => ({ id, data }));
        await updateUsers(updates);
        closeModal('bulkEdit');
    };

    const handleDownloadExcel = async () => {
        await downloadExcel();
    };

    // Stats - usa i dati dal backend se disponibili, altrimenti calcola localmente
    const totalUsers = screenInitData?.statistics?.totalUsers ?? users.length;
    const totalRoles = screenInitData?.statistics?.totalRoles ?? new Set(users.flatMap(u => u.roles.map(r => r.id))).size;
    const totalLists = screenInitData?.statistics?.totalLists ?? new Set(users.flatMap(u => u.lists.map(l => l.id))).size;

    return (
        <div className="flex h-screen w-full bg-[#EFEFEF] overflow-hidden font-sans">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1600px] mx-auto">

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-5 mb-6">
                            <StatCard
                                value={totalUsers}
                                label="Utenti totali"
                                icon={Users}
                                bg="bg-white"
                                textCol="#374151"
                            />
                            <StatCard
                                value={totalRoles || '-'}
                                label="Ruoli disponibili"
                                icon={UserCheck}
                                bg="bg-[#d9f99d]"
                                textCol="#285300"
                            />
                            <StatCard
                                value={totalLists || '-'}
                                label="Liste totali"
                                icon={UsersRound}
                                bg="bg-white"
                                textCol="#374151"
                            />
                        </div>

                        {/* Main Content */}
                        <div className="flex flex-row items-start gap-6">

                            {/* Left Column: User List */}
                            <UserList
                                users={filteredUsers}
                                selectedUserId={selectedUserId}
                                loading={loading}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                onSelectUser={setSelectedUserId}
                                onEditUser={handleEditUser}
                                onDeleteUser={handleDeleteUser}
                                availableRoles={availableOrgRoles}
                                availableLists={availableLists}
                                selectedRoleId={selectedRoleId}
                                selectedListId={selectedListId}
                                onRoleFilterChange={setSelectedRoleId}
                                onListFilterChange={setSelectedListId}
                            />

                            {/* Right Column: Profile & Actions */}
                            <div className="flex-[2] flex flex-col gap-6">

                                {/* Profile Card */}
                                <UserProfileCard
                                    user={selectedUser}
                                    onEdit={() => selectedUser && handleEditUser(selectedUser)}
                                    onResetPassword={() => openModal('resetPassword')}
                                />

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <ActionButton
                                                icon={Download}
                                                onClick={handleDownloadExcel}
                                                isLoading={actionLoading}
                                            >
                                                Esporta elenco utenti
                                            </ActionButton>
                                        </div>
                                        <div className="flex-1">
                                            <ActionButton
                                                variant="secondary"
                                                icon={Edit}
                                                onClick={() => openModal('bulkEdit')}
                                            >
                                                Modifica utenti multipli
                                            </ActionButton>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <ActionButton
                                                icon={UserPlus}
                                                onClick={() => openModal('registerUser')}
                                            >
                                                Registra nuovo utente
                                            </ActionButton>
                                        </div>
                                        <div className="flex-1">
                                            <ActionButton
                                                icon={UsersRound}
                                                onClick={() => openModal('bulkRegister')}
                                            >
                                                Registra utenti multipli
                                            </ActionButton>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex-1">
                                            <ActionButton
                                                variant="destructive"
                                                icon={Trash2}
                                                onClick={() => openModal('bulkDelete')}
                                            >
                                                Elimina utenti multipli
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
            <EditUserModal
                open={modals.editUser}
                user={userToAct}
                onCancel={() => closeModal('editUser')}
                onSave={handleSaveEdit}
                loading={actionLoading}
                availableLists={availableLists}
                availableRoles={availableOrgRoles}
                onGetRolesForList={getAssignableRolesForList}
            />

            <DeleteUserModal
                open={modals.deleteUser}
                user={userToAct}
                onCancel={() => closeModal('deleteUser')}
                onConfirm={handleConfirmDelete}
                loading={actionLoading}
            />

            <ResetPasswordModal
                open={modals.resetPassword}
                user={selectedUser}
                onCancel={() => closeModal('resetPassword')}
                onConfirm={handleConfirmResetPassword}
                loading={actionLoading}
            />

            <RegisterUserModal
                open={modals.registerUser}
                onCancel={() => closeModal('registerUser')}
                onCreate={handleRegisterUser}
                loading={actionLoading}
                availableLists={availableLists}
                availableRoles={availableOrgRoles}
                onGetRolesForList={getAssignableRolesForList}
            />

            <BulkRegisterModal
                open={modals.bulkRegister}
                onCancel={() => closeModal('bulkRegister')}
                onCreateMany={handleBulkRegister}
                loading={actionLoading}
                availableLists={availableLists}
                availableRoles={availableOrgRoles}
                onGetRolesForList={getAssignableRolesForList}
            />

            <BulkDeleteModal
                open={modals.bulkDelete}
                users={users}
                currentUserId={selectedUserId}
                onCancel={() => closeModal('bulkDelete')}
                onConfirm={handleBulkDelete}
                loading={actionLoading}
            />

            <BulkEditModal
                open={modals.bulkEdit}
                users={users}
                currentUserId={selectedUserId}
                onCancel={() => closeModal('bulkEdit')}
                onConfirm={handleBulkEdit}
                loading={actionLoading}
                availableLists={availableLists}
                availableRoles={availableOrgRoles}
                onGetRolesForList={getAssignableRolesForList}
            />
        </div>
    );
};

export default UsersScreen;

