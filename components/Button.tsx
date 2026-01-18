import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'default' | 'lg' | 'wide';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'default',
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden rounded-2xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent";
  
  const variants = {
    primary: "bg-white/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700 shadow-sm backdrop-blur-sm border border-white/20 dark:border-zinc-700/50",
    secondary: "bg-zinc-200/50 dark:bg-zinc-700/30 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 border border-transparent",
    accent: "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 border border-indigo-400/20",
    ghost: "bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white",
  };

  const sizes = {
    default: "h-16 w-16 text-xl",
    lg: "h-20 w-20 text-2xl",
    wide: "h-16 col-span-2 w-full text-xl",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};