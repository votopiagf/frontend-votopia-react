import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Bell, Lock, Globe, Palette } from 'lucide-react';
import authService from '@/test/services/auth.service.ts';
import votopiaIcon from '@/assets/icon.png';
import votopiaText from '@/assets/icon_text.png';
import { Button } from '@/test/components/ui/button.tsx';
import { Input } from '@/test/components/ui/input.tsx';

export default function Impostazioni() {
    const navigate = useNavigate();
    const organization = authService.getCurrentOrganization();

    const [activeTab, setActiveTab] = useState<'generale' | 'notifiche' | 'sicurezza' | 'aspetto'>('generale');

    // Stati per impostazioni generali
    const [nomeOrg, setNomeOrg] = useState(organization?.name || '');
    const [descrizioneOrg, setDescrizioneOrg] = useState(organization?.description || '');
    const [linguaPredefinita, setLinguaPredefinita] = useState('italiano');
    const [fusoOrario, setFusoOrario] = useState('Europe/Rome');

    // Stati per notifiche
    const [emailNotifiche, setEmailNotifiche] = useState(true);
    const [notificheVotazioni, setNotificheVotazioni] = useState(true);
    const [notificheRisultati, setNotificheRisultati] = useState(true);
    const [notificheUtenti, setNotificheUtenti] = useState(false);

    // Stati per sicurezza
    const [autenticazioneDueFattori, setAutenticazioneDueFattori] = useState(false);
    const [durataSessione, setDurataSessione] = useState('24');

    // Stati per aspetto
    const [temaPredefinito, setTemaPredefinito] = useState('chiaro');
    const [colorePrimario, setColorePrimario] = useState('#1A3A82');

    const handleSave = () => {
        // In produzione, salverà via API
        alert('Impostazioni salvate con successo!');
    };

    const tabs = [
        { id: 'generale', label: 'Generale', icon: Globe },
        { id: 'notifiche', label: 'Notifiche', icon: Bell },
        { id: 'sicurezza', label: 'Sicurezza', icon: Lock },
        { id: 'aspetto', label: 'Aspetto', icon: Palette },
    ];

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
                    <h1 className="text-3xl font-bold text-gray-900" data-testid="impostazioni-title">
                        Impostazioni
                    </h1>
                    <p className="mt-2 text-gray-600">Configura le impostazioni del sistema e dell'organizzazione</p>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar tabs */}
                    <div className="w-64 shrink-0">
                        <div className="space-y-1 rounded-lg bg-white p-2 shadow-sm">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-[#1A3A82] text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        data-testid={`tab-${tab.id}`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="flex-1">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            {/* Generale */}
                            {activeTab === 'generale' && (
                                <div className="space-y-6" data-testid="generale-content">
                                    <div>
                                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Impostazioni Generali</h2>
                                        <p className="text-sm text-gray-600">Configura le informazioni base dell'organizzazione</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Nome Organizzazione
                                            </label>
                                            <Input
                                                value={nomeOrg}
                                                onChange={(e) => setNomeOrg(e.target.value)}
                                                placeholder="Nome organizzazione"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Descrizione
                                            </label>
                                            <textarea
                                                value={descrizioneOrg}
                                                onChange={(e) => setDescrizioneOrg(e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base transition-colors focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A82]"
                                                placeholder="Descrizione organizzazione"
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Lingua Predefinita
                                                </label>
                                                <select
                                                    value={linguaPredefinita}
                                                    onChange={(e) => setLinguaPredefinita(e.target.value)}
                                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base transition-colors focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A82]"
                                                >
                                                    <option value="italiano">Italiano</option>
                                                    <option value="inglese">Inglese</option>
                                                    <option value="spagnolo">Spagnolo</option>
                                                    <option value="francese">Francese</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Fuso Orario
                                                </label>
                                                <select
                                                    value={fusoOrario}
                                                    onChange={(e) => setFusoOrario(e.target.value)}
                                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base transition-colors focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A82]"
                                                >
                                                    <option value="Europe/Rome">Europa/Roma (GMT+1)</option>
                                                    <option value="Europe/London">Europa/Londra (GMT+0)</option>
                                                    <option value="America/New_York">America/New York (GMT-5)</option>
                                                    <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifiche */}
                            {activeTab === 'notifiche' && (
                                <div className="space-y-6" data-testid="notifiche-content">
                                    <div>
                                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Notifiche</h2>
                                        <p className="text-sm text-gray-600">Gestisci le preferenze di notifica</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Email Notifiche</h3>
                                                <p className="text-sm text-gray-600">Ricevi notifiche via email</p>
                                            </div>
                                            <button
                                                onClick={() => setEmailNotifiche(!emailNotifiche)}
                                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                                    emailNotifiche ? 'bg-[#1A3A82]' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                                        emailNotifiche ? 'translate-x-5' : 'translate-x-0.5'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Nuove Votazioni</h3>
                                                <p className="text-sm text-gray-600">Notifiche per nuove votazioni create</p>
                                            </div>
                                            <button
                                                onClick={() => setNotificheVotazioni(!notificheVotazioni)}
                                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                                    notificheVotazioni ? 'bg-[#1A3A82]' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                                        notificheVotazioni ? 'translate-x-5' : 'translate-x-0.5'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Risultati Votazioni</h3>
                                                <p className="text-sm text-gray-600">Notifiche per risultati delle votazioni</p>
                                            </div>
                                            <button
                                                onClick={() => setNotificheRisultati(!notificheRisultati)}
                                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                                    notificheRisultati ? 'bg-[#1A3A82]' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                                        notificheRisultati ? 'translate-x-5' : 'translate-x-0.5'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Gestione Utenti</h3>
                                                <p className="text-sm text-gray-600">Notifiche per nuovi utenti e modifiche</p>
                                            </div>
                                            <button
                                                onClick={() => setNotificheUtenti(!notificheUtenti)}
                                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                                    notificheUtenti ? 'bg-[#1A3A82]' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                                        notificheUtenti ? 'translate-x-5' : 'translate-x-0.5'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sicurezza */}
                            {activeTab === 'sicurezza' && (
                                <div className="space-y-6" data-testid="sicurezza-content">
                                    <div>
                                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Sicurezza</h2>
                                        <p className="text-sm text-gray-600">Gestisci le impostazioni di sicurezza</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Autenticazione a Due Fattori</h3>
                                                <p className="text-sm text-gray-600">Aggiungi un ulteriore livello di sicurezza</p>
                                            </div>
                                            <button
                                                onClick={() => setAutenticazioneDueFattori(!autenticazioneDueFattori)}
                                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                                    autenticazioneDueFattori ? 'bg-[#1A3A82]' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                                        autenticazioneDueFattori ? 'translate-x-5' : 'translate-x-0.5'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Durata Sessione (ore)
                                            </label>
                                            <select
                                                value={durataSessione}
                                                onChange={(e) => setDurataSessione(e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base transition-colors focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A82]"
                                            >
                                                <option value="1">1 ora</option>
                                                <option value="4">4 ore</option>
                                                <option value="8">8 ore</option>
                                                <option value="24">24 ore</option>
                                                <option value="168">7 giorni</option>
                                            </select>
                                        </div>

                                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                                            <h3 className="mb-2 flex items-center gap-2 font-medium text-orange-900">
                                                <Lock size={16} />
                                                Zona Pericolosa
                                            </h3>
                                            <p className="mb-4 text-sm text-orange-700">
                                                Azioni irreversibili che potrebbero avere conseguenze importanti
                                            </p>
                                            <Button variant="destructive" size="sm">
                                                Reimposta Password Utenti
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Aspetto */}
                            {activeTab === 'aspetto' && (
                                <div className="space-y-6" data-testid="aspetto-content">
                                    <div>
                                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Aspetto</h2>
                                        <p className="text-sm text-gray-600">Personalizza l'aspetto dell'applicazione</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Tema Predefinito
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['chiaro', 'scuro', 'automatico'].map((tema) => (
                                                    <button
                                                        key={tema}
                                                        onClick={() => setTemaPredefinito(tema)}
                                                        className={`rounded-lg border-2 p-4 text-center transition-colors ${
                                                            temaPredefinito === tema
                                                                ? 'border-[#1A3A82] bg-blue-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="mb-2 text-2xl">
                                                            {tema === 'chiaro' && '☀️'}
                                                            {tema === 'scuro' && '🌙'}
                                                            {tema === 'automatico' && '🔄'}
                                                        </div>
                                                        <span className="text-sm font-medium capitalize text-gray-900">
                                                            {tema}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Colore Primario
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="color"
                                                    value={colorePrimario}
                                                    onChange={(e) => setColorePrimario(e.target.value)}
                                                    className="h-12 w-20 cursor-pointer rounded-lg border border-gray-200"
                                                />
                                                <div className="flex-1">
                                                    <Input value={colorePrimario} readOnly />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                            <h3 className="mb-2 flex items-center gap-2 font-medium text-blue-900">
                                                <Palette size={16} />
                                                Anteprima
                                            </h3>
                                            <div className="space-y-2">
                                                <Button
                                                    className="w-full"
                                                    style={{ backgroundColor: colorePrimario }}
                                                >
                                                    Pulsante Primario
                                                </Button>
                                                <div
                                                    className="rounded-lg p-4 text-white"
                                                    style={{ backgroundColor: colorePrimario }}
                                                >
                                                    Esempio di card con colore personalizzato
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Save button */}
                            <div className="mt-6 flex justify-end border-t pt-6">
                                <Button
                                    onClick={handleSave}
                                    className="bg-[#1A3A82] hover:bg-[#152e6b]"
                                    data-testid="save-settings-button"
                                >
                                    <Save size={20} />
                                    Salva Modifiche
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}