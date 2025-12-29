import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PrimaryButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: LucideIcon;
    isLoading?: boolean;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
    ({ className, children, icon: Icon, isLoading, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(
                    'relative flex h-12 w-full items-center justify-center rounded-lg bg-[#1A3A82] px-4 py-3 text-base font-semibold text-white shadow-md transition-all',
                    'hover:bg-[#152e6b] hover:shadow-lg',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A82] focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#1A3A82] disabled:hover:shadow-md',
                    className
                )}
                disabled={disabled || isLoading}
                ref={ref}
                {...props}
            >
                <span className="flex items-center justify-center">{children}</span>
                {Icon && !isLoading && (
                    <span className="absolute right-4">
            <Icon size={20} />
          </span>
                )}
                {isLoading && (
                    <span className="absolute right-4">
            <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
              <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
              ></circle>
              <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
                )}
            </button>
        );
    }
);
PrimaryButton.displayName = 'PrimaryButton';

export { PrimaryButton };
