import { BriefcaseBusiness, Layers3, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { ProjectList } from '@/components/dashboard/project-list';
import { Card } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

export default async function DashboardPage() {
  const projectsResponse = await apiFetch<any>('/api/v1/projects');
  const projects = projectsResponse.data || [];

  const taskResponses = await Promise.all(
    projects.map((project: any) => apiFetch<any>(`/api/v1/projects/${project.slug}/tasks`).catch(() => ({ data: [] }))),
  );
  const tasks = taskResponses.flatMap((entry) => entry.data || []);

  return (
    <AppShell>
      <section className="mb-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-7 sm:p-8">
          <p className="text-xs uppercase tracking-spa text-muted">Executive overview</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">Projects in motion</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-[15px]">
            Un panel depurado para revisar portafolio, carga operativa y foco de ejecución con la mínima fricción visual posible.
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <StatCard icon={<BriefcaseBusiness className="h-5 w-5" />} label="Projects" value={projects.length} />
          <StatCard icon={<Layers3 className="h-5 w-5" />} label="Tasks" value={tasks.length} />
          <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Session" value="Active" />
        </div>
      </section>

      <ProjectList projects={projects} tasks={tasks} />
    </AppShell>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-spa text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-primary">{value}</p>
    </Card>
  );
}
