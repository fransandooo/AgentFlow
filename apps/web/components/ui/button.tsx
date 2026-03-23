import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-full border border-primary/20 bg-primary px-5 py-2.5 text-sm font-medium text-[#161412] transition duration-200 hover:bg-[#f4ecdf] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
