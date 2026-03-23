import { AppShell } from '@/components/layout/app-shell';
import { ProjectList } from '@/components/dashboard/project-list';
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
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Proyectos activos</h1>
        <p className="mt-2 text-sm text-muted">Resumen global de tareas y estado operativo del sistema.</p>
      </div>
      <ProjectList projects={projects} tasks={tasks} />
    </AppShell>
  );
}
