import Link from 'next/link';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { BellDot, LayoutGrid, LogOut, PanelsTopLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppShell({ children }: { children: ReactNode }) {
  const session = cookies().get('agentflow_session');

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/15 bg-primary/10 text-primary">
                <PanelsTopLeft className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <Link href="/" className="text-xl font-semibold tracking-tight text-primary">
                  AgentFlow
                </Link>
                <p className="max-w-xl text-sm leading-6 text-muted">
                  Orquestación elegante de trabajo para equipos humanos y agentes con un panel limpio y sereno.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-full border border-white/5 bg-panelAlt px-4 py-2 text-xs text-muted">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {session ? 'Sesión activa' : 'Sin sesión'}
              </div>
              <form action="/api/auth/logout" method="post">
                <Button className="w-full gap-2 bg-transparent text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/10 sm:w-auto">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-panelAlt px-4 py-2 hover:text-primary">
              <LayoutGrid className="h-4 w-4" /> Dashboard
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-panelAlt px-4 py-2">
              <BellDot className="h-4 w-4" /> Realtime active
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</main>
    </div>
  );
}
