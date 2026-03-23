import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.12em] uppercase whitespace-nowrap',
        className,
      )}
    >
      {children}
    </span>
  );
}
