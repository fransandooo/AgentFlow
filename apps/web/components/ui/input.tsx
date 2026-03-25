import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'min-h-10 w-full rounded-[6px] border border-border bg-white px-3 py-2 text-sm text-primary outline-none placeholder:text-muted/80 focus:border-accent',
        className,
      )}
      {...props}
    />
  );
}
