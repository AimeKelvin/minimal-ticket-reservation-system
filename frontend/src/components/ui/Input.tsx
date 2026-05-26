import React, { forwardRef } from 'react';
import { cn } from './Button';
export interface InputProps extends
  React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label &&
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-ink mb-1.5">
          
            {label}
          </label>
        }
        <div className="relative">
          {leftIcon &&
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-muted">
              {leftIcon}
            </div>
          }
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'flex h-11 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-danger focus-visible:ring-danger',
              className
            )}
            {...props} />
          
          {rightIcon &&
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-ink-muted">
              {rightIcon}
            </div>
          }
        </div>
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
      </div>);

  }
);
Input.displayName = 'Input';