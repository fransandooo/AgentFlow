import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-[6px] border border-border bg-panel shadow-panel',
        className,
      )}
    >
      {children}
    </div>
  );
}
