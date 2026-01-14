import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, BarChart3, Users, FileText } from 'lucide-react';
import authService from '@/test/services/auth.service.ts';
import votopiaIcon from '@/assets/icon.png';
import votopiaText from '@/assets/icon_text.png';

export default function Dashboard() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const organization = authService.getCurrentOrganization();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const features = [
        {
            icon: BarChart3,
            title: 'Statistiche',
            description: 'Visualizza le statistiche delle votazioni',
            color: 'bg-blue-500',
            path: '/statistiche',
        },
        {
            icon: Users,
            title: 'Utenti',
            description: 'Gestisci gli utenti dell\'organizzazione',
            color: 'bg-green-500',
            path: '/utenti',
        },
        {
            icon: FileText,
            title: 'Votazioni',
            description: 'Crea e gestisci le votazioni',
            color: 'bg-purple-500',
            path: '/votazioni',
        },
        {
            icon: Settings,
            title: 'Impostazioni',
            description: 'Configura le impostazioni del sistema',
            color: 'bg-orange-500',
            path: '/impostazioni',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img src={votopiaIcon} alt="Votopia" className="h-12 w-12" />
                            <img src={votopiaText} alt="Votopia" className="h-8" />
                        </div>

                        {/* User menu */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                                data-testid="profile-button"
                            >
                                <User size={20} />
                                <span className="hidden sm:inline">{user?.firstName} {user?.lastName}</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                                data-testid="logout-button"
                            >
                                <LogOut size={20} />
                                <span className="hidden sm:inline">Esci</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900" data-testid="welcome-title">
                        Benvenuto, {user?.firstName}!
                    </h1>
                    <p className="mt-2 text-lg text-gray-600" data-testid="organization-name">
                        {organization?.name}
                    </p>
                </div>

                {/* Stats cards */}
                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Votazioni Attive</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">12</p>
                            </div>
                            <div className="rounded-lg bg-blue-100 p-3">
                                <FileText className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Utenti Totali</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">248</p>
                            </div>
                            <div className="rounded-lg bg-green-100 p-3">
                                <Users className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Voti Oggi</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">1,234</p>
                            </div>
                            <div className="rounded-lg bg-purple-100 p-3">
                                <BarChart3 className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Partecipazione</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">87%</p>
                            </div>
                            <div className="rounded-lg bg-orange-100 p-3">
                                <Settings className="text-orange-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features grid */}
                <div>
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Funzionalità</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => navigate(feature.path)}
                                    className="group rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
                                    data-testid={`feature-${index}`}
                                >
                                    <div className={`mb-4 inline-flex rounded-lg ${feature.color} p-3`}>
                                        <Icon className="text-white" size={24} />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-[#1A3A82]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
