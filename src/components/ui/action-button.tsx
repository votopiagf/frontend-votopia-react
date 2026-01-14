import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/test/lib/utils.ts';

export interface ActionButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: LucideIcon;
    isLoading?: boolean;
    // Usiamo varianti predefinite invece di HEX manuali per coerenza con il brand
    variant?: 'primary' | 'secondary' | 'destructive';
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ className, children, icon: Icon, isLoading, disabled, variant = 'primary', ...props }, ref) => {

        // Mappatura delle varianti sulle classi Tailwind che abbiamo configurato
        const variantClasses = {
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    // Layout & Shape
                    'relative flex w-full items-center justify-center gap-2 px-5 py-4 rounded-app',
                    'text-[15px] font-medium shadow-md transition-all duration-200',

                    // Variante colore
                    variantClasses[variant],

                    // Effetti
                    'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

                    // Stati Disabilitati
                    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',

                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                ) : (
                    <>
                        {Icon && <Icon size={18} />}
                        <span>{children}</span>
                    </>
                )}
            </button>
        );
    }
);

ActionButton.displayName = 'ActionButton';

export { ActionButton };