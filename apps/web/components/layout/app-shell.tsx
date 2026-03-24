import Link from 'next/link';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { BellDot, Bot, ChevronDown, FolderKanban, LayoutGrid, LogOut, PanelsTopLeft, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';

export async function AppShell({ children }: { children: ReactNode }) {
  const session = cookies().get('agentflow_session');
  const token = session?.value;

  let projects: Array<{ id: string; name: string; slug: string }> = [];
  try {
    const response = await fetch(`${API_URL}/api/v1/projects`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    });
    const payload = await response.json();
    projects = payload?.data || [];
  } catch {
    projects = [];
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden w-[280px] shrink-0 border-r border-[#243754] bg-primary text-white lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-white/10 bg-white/5 text-white">
                <PanelsTopLeft className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">AgentFlow</p>
                <p className="text-xs uppercase tracking-spa text-white/60">Control platform</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6 text-sm">
            <SidebarLink href="/" icon={<LayoutGrid className="h-4 w-4" />} label="Dashboard" />
            <SidebarLink href="/agents" icon={<Bot className="h-4 w-4" />} label="Agents" />
            <SidebarLink href="/teams" icon={<Users className="h-4 w-4" />} label="Teams" />

            <details className="group rounded-[6px] border border-white/10 bg-white/5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-white/85">
                <span className="inline-flex items-center gap-3"><FolderKanban className="h-4 w-4" />Projects</span>
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <div className="space-y-1 border-t border-white/10 px-2 py-2">
                {projects.length ? projects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.slug}`} className="block rounded-[6px] px-3 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white">
                    {project.name}
                  </Link>
                )) : <div className="px-3 py-2 text-sm text-white/50">No projects</div>}
              </div>
            </details>
          </nav>

          <div className="space-y-3 border-t border-white/10 px-4 py-5">
            <div className="flex items-center gap-2 rounded-[6px] bg-white/5 px-3 py-2 text-xs text-white/80">
              <ShieldCheck className="h-4 w-4" />
              {session ? 'Sesión activa' : 'Sin sesión'}
            </div>
            <form action="/api/auth/logout" method="post">
              <Button className="w-full gap-2 border-white/15 bg-white/5 text-white hover:bg-white/10"><LogOut className="h-4 w-4" />Logout</Button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-panel">
            <div className="mx-auto flex w-full max-w-[1880px] items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
              <div>
                <p className="text-sm font-medium text-primary">AgentFlow</p>
                <p className="text-xs text-muted">OpenClaw operations and task control</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-[6px] border border-border bg-panelAlt px-3 py-2 text-xs text-muted">
                <BellDot className="h-4 w-4 text-accent" />Realtime active
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1880px] px-4 py-8 sm:px-6 xl:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-[6px] px-4 py-3 text-white/80 transition hover:bg-white/5 hover:text-white">
      {icon}
      <span>{label}</span>
    </Link>
  );
}
