import { useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/primary-button';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1A3A82] to-[#81BE47] px-4">
            <div className="text-center">
                <div className="mb-8">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/10 p-6">
                        <Search className="text-white" size={64} />
                    </div>
                    <h1 className="mb-4 text-8xl font-bold text-white" data-testid="404-title">
                        404
                    </h1>
                    <h2 className="mb-2 text-2xl font-semibold text-white">
                        Pagina Non Trovata
                    </h2>
                    <p className="text-lg text-white/80">
                        La pagina che stai cercando non esiste o è stata spostata.
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-xs">
                        <PrimaryButton
                            data-testid="home-button"
                            onClick={() => navigate('/')}
                            icon={Home}
                            className="bg-white text-[#1A3A82] hover:bg-gray-100"
                        >
                            Torna alla Home
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
