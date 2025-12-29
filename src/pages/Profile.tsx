import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Building2, Shield } from 'lucide-react';
import authService from '@/services/auth.service';
import votopiaIcon from '@/assets/icon.png';
import votopiaText from '@/assets/icon_text.png';

export default function Profile() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const organization = authService.getCurrentOrganization();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={votopiaIcon} alt="Votopia" className="h-12 w-12" />
                            <img src={votopiaText} alt="Votopia" className="h-8" />
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                            data-testid="back-to-dashboard"
                        >
                            <ArrowLeft size={20} />
                            <span>Dashboard</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900" data-testid="profile-title">
                        Il Mio Profilo
                    </h1>
                    <p className="mt-2 text-gray-600">Informazioni personali e organizzazione</p>
                </div>

                {/* Profile card */}
                <div className="rounded-lg bg-white p-8 shadow-sm">
                    {/* Avatar section */}
                    <div className="mb-8 flex items-center gap-6">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1A3A82] text-3xl font-bold text-white">
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900" data-testid="user-full-name">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <p className="mt-1 text-gray-600">{user?.role}</p>
                        </div>
                    </div>

                    {/* User info */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Informazioni Personali</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-100 p-2">
                                        <User className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nome Completo</p>
                                        <p className="font-medium text-gray-900" data-testid="user-name">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-green-100 p-2">
                                        <Mail className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900" data-testid="user-email">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-purple-100 p-2">
                                        <Shield className="text-purple-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Ruolo</p>
                                        <p className="font-medium text-gray-900" data-testid="user-role">
                                            {user?.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Organization info */}
                        <div className="border-t pt-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Organizzazione</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-orange-100 p-2">
                                        <Building2 className="text-orange-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nome Organizzazione</p>
                                        <p className="font-medium text-gray-900" data-testid="org-name">
                                            {organization?.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-yellow-100 p-2">
                                        <Building2 className="text-yellow-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Codice Organizzazione</p>
                                        <p className="font-medium text-gray-900" data-testid="org-code">
                                            {organization?.code}
                                        </p>
                                    </div>
                                </div>

                                {organization?.description && (
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-sm text-gray-600">Descrizione</p>
                                        <p className="mt-1 text-gray-900" data-testid="org-description">
                                            {organization.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
