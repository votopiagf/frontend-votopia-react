import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import votopiaIcon from '@/assets/icon.png';
import votopiaText from '@/assets/icon_text.png';
import { Button } from '@/components/ui/button';

interface Votazione {
    id: string;
    titolo: string;
    descrizione: string;
    dataInizio: string;
    dataFine: string;
    stato: 'attiva' | 'chiusa' | 'programmata';
    partecipanti: number;
    voti: number;
}

export default function Votazioni() {
    const navigate = useNavigate();
    const [filtro, setFiltro] = useState<'tutte' | 'attive' | 'chiuse' | 'programmate'>('tutte');

    // Dati mock - in produzione verranno da API
    const votazioni: Votazione[] = [
        {
            id: '1',
            titolo: 'Elezione Rappresentante di Classe',
            descrizione: 'Elezione del nuovo rappresentante per l\'anno accademico 2025',
            dataInizio: '2025-01-15',
            dataFine: '2025-01-20',
            stato: 'attiva',
            partecipanti: 248,
            voti: 187
        },
        {
            id: '2',
            titolo: 'Referendum Nuova Sede',
            descrizione: 'Votazione per la scelta della nuova sede dell\'organizzazione',
            dataInizio: '2025-01-10',
            dataFine: '2025-01-12',
            stato: 'chiusa',
            partecipanti: 248,
            voti: 248
        },
        {
            id: '3',
            titolo: 'Votazione Budget 2025',
            descrizione: 'Approvazione del budget annuale per il 2025',
            dataInizio: '2025-02-01',
            dataFine: '2025-02-05',
            stato: 'programmata',
            partecipanti: 248,
            voti: 0
        },
        {
            id: '4',
            titolo: 'Scelta Progetto Semestrale',
            descrizione: 'Votazione per il progetto da realizzare nel semestre',
            dataInizio: '2025-01-08',
            dataFine: '2025-01-14',
            stato: 'attiva',
            partecipanti: 248,
            voti: 142
        }
    ];

    const votazioniFiltrate = filtro === 'tutte'
        ? votazioni
        : votazioni.filter(v => v.stato === filtro.replace('e', 'a'));

    const getStatoIcon = (stato: string) => {
        switch(stato) {
            case 'attiva': return <Clock className="text-green-600" size={20} />;
            case 'chiusa': return <CheckCircle className="text-gray-600" size={20} />;
            case 'programmata': return <Calendar className="text-blue-600" size={20} />;
            default: return null;
        }
    };

    const getStatoColor = (stato: string) => {
        switch(stato) {
            case 'attiva': return 'bg-green-100 text-green-700';
            case 'chiusa': return 'bg-gray-100 text-gray-700';
            case 'programmata': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
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
                        <h1 className="text-3xl font-bold text-gray-900" data-testid="votazioni-title">
                            Gestione Votazioni
                        </h1>
                        <p className="mt-2 text-gray-600">Crea e gestisci le votazioni della tua organizzazione</p>
                    </div>
                    <Button
                        className="bg-[#1A3A82] hover:bg-[#152e6b]"
                        data-testid="create-votazione-button"
                    >
                        <Plus size={20} />
                        Nuova Votazione
                    </Button>
                </div>

                {/* Filtri */}
                <div className="mb-6 flex gap-2" data-testid="filters">
                    {['tutte', 'attive', 'chiuse', 'programmate'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFiltro(f as any)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                filtro === f
                                    ? 'bg-[#1A3A82] text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                            data-testid={`filter-${f}`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Lista votazioni */}
                <div className="space-y-4">
                    {votazioniFiltrate.map((votazione) => (
                        <div
                            key={votazione.id}
                            className="group cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
                            data-testid={`votazione-${votazione.id}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="mb-3 flex items-center gap-3">
                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#1A3A82]">
                                            {votazione.titolo}
                                        </h3>
                                        <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatoColor(votazione.stato)}`}>
                                            {getStatoIcon(votazione.stato)}
                                            {votazione.stato.charAt(0).toUpperCase() + votazione.stato.slice(1)}
                                        </span>
                                    </div>
                                    <p className="mb-4 text-gray-600">{votazione.descrizione}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>
                                                {new Date(votazione.dataInizio).toLocaleDateString('it-IT')} - {new Date(votazione.dataFine).toLocaleDateString('it-IT')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={16} />
                                            <span>
                                                {votazione.voti} / {votazione.partecipanti} voti ({Math.round((votazione.voti / votazione.partecipanti) * 100)}%)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="ml-4"
                                    data-testid={`view-votazione-${votazione.id}`}
                                >
                                    Dettagli
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {votazioniFiltrate.length === 0 && (
                    <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                        <XCircle className="mx-auto mb-4 text-gray-400" size={48} />
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">Nessuna votazione trovata</h3>
                        <p className="text-gray-600">Non ci sono votazioni {filtro !== 'tutte' ? filtro : ''} al momento.</p>
                    </div>
                )}
            </main>
        </div>
    );
}