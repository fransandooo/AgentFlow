import { RadioTower, Rows3, Waypoints } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { KanbanBoard } from '@/components/board/kanban-board';
import { Card } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

export default async function ProjectBoardPage({ params, searchParams }: { params: { slug: string }; searchParams?: { teamId?: string } }) {
  const [response, teamsRes] = await Promise.all([
    apiFetch<any>(`/api/v1/projects/${params.slug}/board${searchParams?.teamId ? `?teamId=${searchParams.teamId}` : ''}`),
    apiFetch<any>('/api/v1/teams').catch(() => ({ data: [] })),
  ]);
  const { project, columns, tasks } = response.data;
  const teams = teamsRes.data || [];

  return (
    <AppShell>
      <section className="mb-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-7 sm:p-8">
          <p className="text-xs uppercase tracking-spa text-muted">Project board</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">{project.name}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-[15px]">Espacio de ejecución en tiempo real, diseñado para lectura rápida, foco alto y seguimiento elegante.</p>
          <form className="mt-6">
            <select name="teamId" defaultValue={searchParams?.teamId || ''} className="min-h-10 rounded-[6px] border border-border bg-white px-4 py-2 text-sm text-primary outline-none focus:border-accent">
              <option value="">All teams</option>
              {teams.map((team: any) => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
            <button className="ml-3 rounded-[6px] border border-primary bg-primary px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-accent hover:border-accent">Filter</button>
          </form>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <BoardStat icon={<Rows3 className="h-5 w-5" />} label="Columns" value={columns.length} />
          <BoardStat icon={<Waypoints className="h-5 w-5" />} label="Tasks" value={tasks.length} />
          <BoardStat icon={<RadioTower className="h-5 w-5" />} label="Realtime" value="Connected" />
        </div>
      </section>

      <KanbanBoard projectId={project.id} projectSlug={params.slug} initialTasks={tasks} columns={columns} />
    </AppShell>
  );
}

function BoardStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return <Card className="p-5"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-primary/10 text-primary">{icon}</div><p className="text-xs uppercase tracking-spa text-muted">{label}</p><p className="mt-3 text-2xl font-semibold tracking-tight text-primary">{value}</p></Card>;
}
