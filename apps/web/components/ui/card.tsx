import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-2xl border border-border bg-panel/80 backdrop-blur', className)}>{children}</div>;
}
