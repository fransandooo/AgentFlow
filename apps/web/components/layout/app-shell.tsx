import Link from 'next/link';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';

export function AppShell({ children }: { children: ReactNode }) {
  const session = cookies().get('agentflow_session');

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-white">
              AgentFlow
            </Link>
            <p className="text-xs text-muted">Realtime task orchestration for humans + agents</p>
          </div>
          <div className="flex items-center gap-3">
            {session ? <span className="text-xs text-muted">Sesión activa</span> : null}
            <form action="/api/auth/logout" method="post">
              <Button className="bg-slate-800 shadow-none">Logout</Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
