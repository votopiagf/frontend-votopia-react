export const AppColor = {
    primary: '#1A3A82',       // Azzurro Votopia
    secondary: '#d9f99d',     // Verde/Oro tenue
    background: '#F8F9FB',    // Sfondo chiaro
    surface: '#FFFFFF',       // Bianco (card, fogli)
    textPrimary: '#1E1E1E',   // Testo principale (quasi nero)
    textSecondary: '#6B6B6B', // Testo secondario (grigio)

    // Aggiungiamo quelli di sistema utili che avevi nel file precedente
    delete: '#9C0000',
    error: '#EF4444',
    success: '#336900',
} as const;

export type AppColor = keyof typeof AppColor;