import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectSummary, TaskItem } from '@/lib/types';

export function ProjectList({ projects, tasks }: { projects: ProjectSummary[]; tasks: TaskItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const projectTasks = tasks.filter((task) => task.projectId === project.id);
        const inProgress = projectTasks.filter((task) => task.status === 'IN_PROGRESS').length;
        const blocked = projectTasks.filter((task) => task.status === 'BLOCKED').length;

        return (
          <Link key={project.id} href={`/projects/${project.slug}`}>
            <Card className="h-full p-5 transition hover:border-primary hover:bg-panelAlt/70">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 h-2 w-12 rounded-full" style={{ backgroundColor: project.color }} />
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <p className="mt-1 text-sm text-muted">{project.description || 'Sin descripción'}</p>
                </div>
                <Badge className="bg-slate-800 text-slate-200">{projectTasks.length} tareas</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="text-muted">Totales</p>
                  <p className="mt-1 text-lg font-semibold">{projectTasks.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="text-muted">En curso</p>
                  <p className="mt-1 text-lg font-semibold text-sky-300">{inProgress}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="text-muted">Bloqueadas</p>
                  <p className="mt-1 text-lg font-semibold text-rose-300">{blocked}</p>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
