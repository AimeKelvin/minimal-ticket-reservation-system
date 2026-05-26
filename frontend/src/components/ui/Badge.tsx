import React from 'react';
import { cn } from './Button';
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}
export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-canvas text-ink border border-border',
    success: 'bg-success-soft text-success border border-success/20',
    warning: 'bg-warning-soft text-warning border border-warning/20',
    danger: 'bg-danger-soft text-danger border border-danger/20',
    outline: 'text-ink border border-border-strong'
  };
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props} />);


}