import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon: Icon, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base transition-colors',
                        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'placeholder:text-gray-400',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A82] focus-visible:border-transparent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        Icon && 'pl-11',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
