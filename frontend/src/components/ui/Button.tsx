import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
  {
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  },
  ref) =>
  {
    const variants = {
      primary: 'bg-accent text-accent-ink hover:bg-accent-hover shadow-sm',
      secondary: 'bg-canvas text-ink hover:bg-border border border-border',
      outline: 'border border-border-strong text-ink hover:bg-canvas',
      ghost: 'text-ink-muted hover:text-ink hover:bg-canvas',
      danger: 'bg-danger text-white hover:bg-danger/90 shadow-sm'
    };
    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10 flex items-center justify-center p-0'
    };
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}>
        
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>);

  }
);
Button.displayName = 'Button';