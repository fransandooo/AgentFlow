import { AppShell } from '@/components/layout/app-shell';
import { KanbanBoard } from '@/components/board/kanban-board';
import { apiFetch } from '@/lib/api';

export default async function ProjectBoardPage({ params }: { params: { slug: string } }) {
  const response = await apiFetch<any>(`/api/v1/projects/${params.slug}/board`);
  const { project, columns, tasks } = response.data;

  return (
    <AppShell>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary">Board</p>
          <h1 className="mt-2 text-3xl font-semibold">{project.name}</h1>
          <p className="mt-2 text-sm text-muted">Kanban en tiempo real con sincronización vía WebSocket.</p>
        </div>
      </div>
      <KanbanBoard projectId={project.id} initialTasks={tasks} columns={columns} />
    </AppShell>
  );
}
