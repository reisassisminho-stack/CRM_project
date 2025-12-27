
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm border-transparent',
            secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-sm border-transparent',
            outline: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
            ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent',
            danger: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2',
            lg: 'px-6 py-3 text-lg',
        };

        return (
            <button
                ref={ref}
                className={twMerge(
                    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed border',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';
