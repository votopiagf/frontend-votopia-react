import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, FileText, Activity, Calendar } from 'lucide-react';
import authService from '@/services/auth.service';
import votopiaIcon from '@/assets/icon.png';
import votopiaText from '@/assets/icon_text.png';

export default function Statistiche() {
    const navigate = useNavigate();
    const organization = authService.getCurrentOrganization();

    // Dati statistici mock
    const stats = {
        votazioniTotali: 45,
        votazioniAttive: 12,
        utentiTotali: 248,
        votiOggi: 1234,
        partecipazioneMedia: 87,
        crescitaMensile: 15.3
    };

    const votazioniRecenti = [
        { nome: 'Elezione Rappresentante', voti: 187, totale: 248, percentuale: 75 },
        { nome: 'Referendum Sede', voti: 248, totale: 248, percentuale: 100 },
        { nome: 'Progetto Semestrale', voti: 142, totale: 248, percentuale: 57 },
        { nome: 'Budget 2025', voti: 98, totale: 248, percentuale: 40 },
    ];

    const andamentoMensile = [
        { mese: 'Gen', voti: 3240 },
        { mese: 'Feb', voti: 2890 },
        { mese: 'Mar', voti: 4120 },
        { mese: 'Apr', voti: 3650 },
        { mese: 'Mag', voti: 4890 },
        { mese: 'Giu', voti: 5230 },
    ];

    const maxVoti = Math.max(...andamentoMensile.map(m => m.voti));

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
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900" data-testid="statistiche-title">
                        Statistiche e Analytics
                    </h1>
                    <p className="mt-2 text-gray-600">{organization?.name}</p>
                </div>

                {/* Stats cards principali */}
                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Votazioni Attive</p>
                                <p className="mt-2 text-4xl font-bold">{stats.votazioniAttive}</p>
                                <p className="mt-2 text-xs opacity-75">su {stats.votazioniTotali} totali</p>
                            </div>
                            <div className="rounded-full bg-white/20 p-4">
                                <FileText size={32} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Utenti Registrati</p>
                                <p className="mt-2 text-4xl font-bold">{stats.utentiTotali}</p>
                                <p className="mt-2 flex items-center gap-1 text-xs opacity-75">
                                    <TrendingUp size={14} />
                                    +{stats.crescitaMensile}% questo mese
                                </p>
                            </div>
                            <div className="rounded-full bg-white/20 p-4">
                                <Users size={32} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Partecipazione Media</p>
                                <p className="mt-2 text-4xl font-bold">{stats.partecipazioneMedia}%</p>
                                <p className="mt-2 text-xs opacity-75">{stats.votiOggi} voti oggi</p>
                            </div>
                            <div className="rounded-full bg-white/20 p-4">
                                <Activity size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafici */}
                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                    {/* Andamento mensile */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Andamento Mensile</h2>
                            <Calendar className="text-gray-400" size={20} />
                        </div>
                        <div className="space-y-4">
                            {andamentoMensile.map((dato, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700">{dato.mese}</span>
                                        <span className="text-gray-600">{dato.voti.toLocaleString()} voti</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                            style={{ width: `${(dato.voti / maxVoti) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Votazioni recenti */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Votazioni Recenti</h2>
                            <TrendingUp className="text-gray-400" size={20} />
                        </div>
                        <div className="space-y-4">
                            {votazioniRecenti.map((votazione, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700">{votazione.nome}</span>
                                        <span className="text-gray-600">
                                            {votazione.voti}/{votazione.totale}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    votazione.percentuale >= 75
                                                        ? 'bg-green-500'
                                                        : votazione.percentuale >= 50
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
                                                }`}
                                                style={{ width: `${votazione.percentuale}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">
                                            {votazione.percentuale}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Insights Chiave</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <div className="rounded-full bg-blue-500 p-1">
                                    <TrendingUp className="text-white" size={16} />
                                </div>
                                <h3 className="font-semibold text-blue-900">Trend Positivo</h3>
                            </div>
                            <p className="text-sm text-blue-700">
                                La partecipazione è aumentata del 15% nell'ultimo mese
                            </p>
                        </div>

                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <div className="rounded-full bg-green-500 p-1">
                                    <Users className="text-white" size={16} />
                                </div>
                                <h3 className="font-semibold text-green-900">Engagement Alto</h3>
                            </div>
                            <p className="text-sm text-green-700">
                                87% degli utenti hanno votato nell'ultima settimana
                            </p>
                        </div>

                        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <div className="rounded-full bg-purple-500 p-1">
                                    <FileText className="text-white" size={16} />
                                </div>
                                <h3 className="font-semibold text-purple-900">Attività Intensa</h3>
                            </div>
                            <p className="text-sm text-purple-700">
                                12 votazioni attive simultaneamente - record storico
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}