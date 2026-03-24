import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'min-h-10 w-full rounded-[6px] border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-accent',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
