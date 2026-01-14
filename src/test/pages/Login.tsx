import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, ArrowRight, ArrowLeft, LogIn } from 'lucide-react';
import { Input } from '@/test/components/ui/input.tsx';
import {ActionButton} from '@/test/components/ui/action-button.tsx';
import authService from '@/test/services/auth.service.ts';
import type {Organization} from '@/test/types/auth.types.ts';

// Importa loghi
import votopiaIcon from '@/assets/icon.png';
import votopiaText from '@/assets/icon_text.png';

export default function Login() {
    const navigate = useNavigate();
    const [showCredentials, setShowCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [organizationCode, setOrganizationCode] = useState('');
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Gestione verifica organizzazione
    const handleOrganizationCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Il servizio ora restituisce direttamente l'Organization oppure lancia un errore
            const org = await authService.checkOrganization(organizationCode);
            setOrganization(org);
            setShowCredentials(true);
            setEmail('');
            setPassword('');
        } catch (err: any) {
            // L'API client normalizza gli errori in { message, status, errors }
            const message = err?.message || 'Organizzazione non trovata';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Gestione login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await authService.login(email, password, organizationCode);

            // Se il backend ha restituito il token, procedi
            if (result?.token) {
                navigate('/users');
            } else {
                setError('Credenziali non valide');
            }
        } catch (err: any) {
            const message = err?.message || 'Errore durante il login';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Torna indietro
    const handleBack = () => {
        setShowCredentials(false);
        setError(null);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#1A3A82] px-4 py-8">
            <div className="w-full max-w-md">
                {/* Card principale */}
                <div
                    className="rounded-2xl bg-white p-8 shadow-xl transition-all duration-300"
                    style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)' }}
                >
                    {/* Animazione tra le due fasi */}
                    <div className="relative overflow-hidden">
                        {!showCredentials ? (
                            // FASE 1: Selezione Organizzazione
                            <div
                                key="organization"
                                className="animate-in fade-in slide-in-from-right-5 duration-400"
                            >
                                {/* Header con logo */}
                                <div className="mb-8 flex items-center justify-center gap-4">
                                    <img
                                        src={votopiaIcon}
                                        alt="Votopia"
                                        className="h-20 w-20"
                                    />
                                    <div className="flex flex-col">
                                        <img
                                            src={votopiaText}
                                            alt="Votopia"
                                            className="h-12"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Seleziona organizzazione
                                        </p>
                                    </div>
                                </div>

                                {/* Form organizzazione */}
                                <form onSubmit={handleOrganizationCheck} className="space-y-6">
                                    <div>
                                        <Input
                                            data-testid="organization-code-input"
                                            type="text"
                                            placeholder="Codice organizzazione"
                                            icon={Building2}
                                            value={organizationCode}
                                            onChange={(e) => setOrganizationCode(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Messaggio di errore */}
                                    {error && (
                                        <div
                                            data-testid="error-message"
                                            className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                                        >
                                            {error}
                                        </div>
                                    )}

                                    <ActionButton
                                        data-testid="organization-submit-button"
                                        type="submit"
                                        icon={ArrowRight}
                                        isLoading={isLoading}
                                    >
                                        Avanti
                                    </ActionButton>
                                </form>
                            </div>
                        ) : (
                            // FASE 2: Credenziali Login
                            <div
                                key="credentials"
                                className="animate-in fade-in slide-in-from-left-5 duration-400"
                            >
                                {/* Pulsante indietro */}
                                <button
                                    data-testid="back-button"
                                    onClick={handleBack}
                                    className="mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-800"
                                    disabled={isLoading}
                                >
                                    <ArrowLeft size={20} />
                                    <span className="text-sm">Indietro</span>
                                </button>

                                {/* Header con logo e nome organizzazione */}
                                <div className="mb-8 flex flex-col items-center text-center">
                                    <img
                                        src={votopiaIcon}
                                        alt="Votopia"
                                        className="mb-3 h-24 w-24"
                                    />
                                    <img
                                        src={votopiaText}
                                        alt="Votopia"
                                        className="mb-3 h-12"
                                    />
                                    <h2
                                        data-testid="organization-name"
                                        className="text-2xl font-bold text-gray-700"
                                    >
                                        {organization?.name.toUpperCase() || 'ORGANIZZAZIONE'}
                                    </h2>
                                </div>

                                {/* Form login */}
                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div>
                                        <Input
                                            data-testid="email-input"
                                            type="email"
                                            placeholder="Email"
                                            icon={Mail}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Input
                                            data-testid="password-input"
                                            type="password"
                                            placeholder="Password"
                                            icon={Lock}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Messaggio di errore */}
                                    {error && (
                                        <div
                                            data-testid="error-message"
                                            className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                                        >
                                            {error}
                                        </div>
                                    )}

                                    <ActionButton
                                        data-testid="login-submit-button"
                                        type="submit"
                                        icon={LogIn}
                                        isLoading={isLoading}
                                    >
                                        Accedi
                                    </ActionButton>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-white/80">
                    © 2025 Votopia. Tutti i diritti riservati.
                </p>
            </div>
        </div>
    );
}
