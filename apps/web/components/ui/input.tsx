import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'min-h-12 w-full rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-white outline-none placeholder:text-muted/65 focus:border-primary/40',
        className,
      )}
      {...props}
    />
  );
}
