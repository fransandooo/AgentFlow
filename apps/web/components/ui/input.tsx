import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-border bg-panelAlt px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-primary',
        className,
      )}
      {...props}
    />
  );
}
