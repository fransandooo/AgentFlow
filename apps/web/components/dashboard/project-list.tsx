import Link from 'next/link';
import { ArrowUpRight, CircleOff, FolderKanban, LoaderCircle, Rows3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectSummary, TaskItem } from '@/lib/types';

export function ProjectList({ projects, tasks }: { projects: ProjectSummary[]; tasks: TaskItem[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const projectTasks = tasks.filter((task) => task.projectId === project.id);
        const inProgress = projectTasks.filter((task) => task.status === 'IN_PROGRESS').length;
        const blocked = projectTasks.filter((task) => task.status === 'BLOCKED').length;

        return (
          <Link key={project.id} href={`/projects/${project.slug}`}>
            <Card className="h-full p-6 transition duration-200 hover:border-primary/20 hover:bg-panelAlt/80">
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-primary/10 text-primary">
                          <FolderKanban className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold tracking-tight text-primary">{project.name}</h2>
                          <p className="text-sm leading-6 text-muted">{project.description || 'No description available yet.'}</p>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">{projectTasks.length} tasks</Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <MetricCard icon={<Rows3 className="h-4 w-4" />} label="Total" value={projectTasks.length} />
                    <MetricCard icon={<LoaderCircle className="h-4 w-4" />} label="In progress" value={inProgress} />
                    <MetricCard icon={<CircleOff className="h-4 w-4" />} label="Blocked" value={blocked} />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 text-sm text-muted">
                  <span>Open workspace</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-background/30 px-4 py-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-panelAlt text-primary">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-primary">{value}</p>
    </div>
  );
}
