import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'default' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700',
      primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20',
      secondary: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600',
      accent: 'bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-500/20',
      ghost: 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800',
    };

    const sizes = {
      default: 'h-16 text-xl rounded-2xl',
      lg: 'h-20 text-2xl rounded-3xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative flex items-center justify-center font-medium transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
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