// Piccolo helper per leggere import.meta.env in modo tipato e riutilizzabile
export function isDev(): boolean {
    return Boolean((import.meta as unknown as { env?: { DEV?: boolean } })?.env?.DEV);
}

export function getEnvVar(name: string): string | undefined {
    return (import.meta as unknown as { env?: Record<string, string> })?.env?.[name];
}

export function getApiUrl(): string {
    return getEnvVar('VITE_API_URL') || getEnvVar('VITE_API_BASE_URL') || '';
}
