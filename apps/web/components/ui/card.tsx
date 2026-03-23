import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-border/90 bg-panel/88 shadow-panel backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
