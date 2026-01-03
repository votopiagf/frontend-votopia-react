import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Mail, Shield, UserCheck, UserX } from 'lucide-react';
import votopiaIcon from '@/assets/icon.png';
import votopiaText from '@/assets/icon_text.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Utente {
    id: string;
    nome: string;
    cognome: string;
    email: string;
    ruolo: string;
    stato: 'attivo' | 'inattivo';
    dataRegistrazione: string;
}

export default function Utenti() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroRuolo, setFiltroRuolo] = useState<'tutti' | 'admin' | 'membro' | 'ospite'>('tutti');

    // Dati mock - in produzione verranno da API
    const utenti: Utente[] = [
        {
            id: '1',
            nome: 'Mario',
            cognome: 'Rossi',
            email: 'mario.rossi@example.com',
            ruolo: 'admin',
            stato: 'attivo',
            dataRegistrazione: '2024-01-15'
        },
        {
            id: '2',
            nome: 'Laura',
            cognome: 'Bianchi',
            email: 'laura.bianchi@example.com',
            ruolo: 'membro',
            stato: 'attivo',
            dataRegistrazione: '2024-02-20'
        },
        {
            id: '3',
            nome: 'Giuseppe',
            cognome: 'Verdi',
            email: 'giuseppe.verdi@example.com',
            ruolo: 'membro',
            stato: 'attivo',
            dataRegistrazione: '2024-03-10'
        },
        {
            id: '4',
            nome: 'Anna',
            cognome: 'Neri',
            email: 'anna.neri@example.com',
            ruolo: 'ospite',
            stato: 'inattivo',
            dataRegistrazione: '2024-04-05'
        },
        {
            id: '5',
            nome: 'Paolo',
            cognome: 'Gialli',
            email: 'paolo.gialli@example.com',
            ruolo: 'membro',
            stato: 'attivo',
            dataRegistrazione: '2024-05-12'
        }
    ];

    const utentiFiltrati = utenti.filter(u => {
        const matchSearch = searchTerm === '' ||
            u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchRuolo = filtroRuolo === 'tutti' || u.ruolo === filtroRuolo;

        return matchSearch && matchRuolo;
    });

    const getRuoloColor = (ruolo: string) => {
        switch(ruolo) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'membro': return 'bg-blue-100 text-blue-700';
            case 'ospite': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getRuoloIcon = (ruolo: string) => {
        switch(ruolo) {
            case 'admin': return <Shield size={16} />;
            case 'membro': return <UserCheck size={16} />;
            case 'ospite': return <UserX size={16} />;
            default: return null;
        }
    };

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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900" data-testid="utenti-title">
                            Gestione Utenti
                        </h1>
                        <p className="mt-2 text-gray-600">Gestisci gli utenti della tua organizzazione</p>
                    </div>
                    <Button
                        className="bg-[#1A3A82] hover:bg-[#152e6b]"
                        data-testid="add-user-button"
                    >
                        <Plus size={20} />
                        Aggiungi Utente
                    </Button>
                </div>

                {/* Filtri e ricerca */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Barra di ricerca */}
                    <div className="w-full sm:w-96">
                        <Input
                            icon={Search}
                            placeholder="Cerca utente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            data-testid="search-input"
                        />
                    </div>

                    {/* Filtri ruolo */}
                    <div className="flex gap-2">
                        {['tutti', 'admin', 'membro', 'ospite'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFiltroRuolo(f as any)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    filtroRuolo === f
                                        ? 'bg-[#1A3A82] text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                                data-testid={`filter-${f}`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Statistiche */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Totale Utenti</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{utenti.length}</p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Utenti Attivi</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">
                            {utenti.filter(u => u.stato === 'attivo').length}
                        </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Amministratori</p>
                        <p className="mt-1 text-2xl font-bold text-purple-600">
                            {utenti.filter(u => u.ruolo === 'admin').length}
                        </p>
                    </div>
                </div>

                {/* Tabella utenti */}
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full" data-testid="users-table">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Utente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Ruolo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Stato
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Registrazione
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Azioni
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {utentiFiltrati.map((utente) => (
                                <tr key={utente.id} className="hover:bg-gray-50" data-testid={`user-row-${utente.id}`}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A3A82] text-sm font-semibold text-white">
                                                {utente.nome.charAt(0)}{utente.cognome.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {utente.nome} {utente.cognome}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                            <Mail size={16} className="text-gray-400" />
                                            {utente.email}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getRuoloColor(utente.ruolo)}`}>
                                                {getRuoloIcon(utente.ruolo)}
                                                {utente.ruolo.charAt(0).toUpperCase() + utente.ruolo.slice(1)}
                                            </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                utente.stato === 'attivo'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {utente.stato.charAt(0).toUpperCase() + utente.stato.slice(1)}
                                            </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {new Date(utente.dataRegistrazione).toLocaleDateString('it-IT')}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            data-testid={`edit-user-${utente.id}`}
                                        >
                                            Modifica
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {utentiFiltrati.length === 0 && (
                    <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                        <UserX className="mx-auto mb-4 text-gray-400" size={48} />
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">Nessun utente trovato</h3>
                        <p className="text-gray-600">Prova a modificare i filtri di ricerca.</p>
                    </div>
                )}
            </main>
        </div>
    );
}