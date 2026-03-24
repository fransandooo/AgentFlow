'use client';

import Link from 'next/link';
import { Activity, BriefcaseBusiness, Cpu, RadioTower } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createSocket } from '@/lib/socket';
import { DashboardData } from '@/lib/types';
import { formatDate, formatStatus } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export function DashboardLive({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const socket = createSocket();
    socket.emit('join:global');

    const refresh = async () => {
      const response = await fetch('/api/dashboard', { cache: 'no-store' });
      const payload = await response.json();
      setData(payload.data);
    };

    socket.on('task:updated', refresh);
    socket.on('task:created', refresh);
    socket.on('task:status_changed', refresh);
    socket.on('task:comment_added', refresh);
    socket.on('agent:activity', refresh);

    return () => {
      socket.disconnect();
    };
  }, []);

  const inProgress = useMemo(
    () => data.metrics.tasksByStatus.find((item) => item.status === 'IN_PROGRESS')?._count._all || 0,
    [data],
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<BriefcaseBusiness className="h-5 w-5" />} label="Projects" value={data.metrics.projects} />
        <StatCard icon={<Activity className="h-5 w-5" />} label="Tasks" value={data.metrics.tasks} />
        <StatCard icon={<RadioTower className="h-5 w-5" />} label="In Progress" value={inProgress} />
        <StatCard icon={<Cpu className="h-5 w-5" />} label="Agents" value={data.agents.length} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="p-6 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-spa text-muted">Portfolio</p>
              <h2 className="mt-2 text-2xl font-semibold text-primary">Global projects</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="rounded-3xl border border-white/5 bg-background/25 p-5 transition hover:border-primary/15">
                <div className="space-y-3">
                  <div className="h-2 w-12 rounded-full" style={{ backgroundColor: project.color }} />
                  <div>
                    <h3 className="text-lg font-semibold text-primary">{project.name}</h3>
                    <p className="mt-1 text-sm text-muted">{project.description || 'No description.'}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <MiniMetric label="Tasks" value={project.taskCount} />
                    <MiniMetric label="Active" value={project.inProgress} />
                    <MiniMetric label="Blocked" value={project.blocked} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 sm:p-7">
            <p className="text-xs uppercase tracking-spa text-muted">Agents</p>
            <h2 className="mt-2 text-2xl font-semibold text-primary">Live status</h2>
            <div className="mt-5 space-y-3">
              {data.agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between rounded-3xl border border-white/5 bg-background/25 px-4 py-4">
                  <div>
                    <p className="font-medium text-primary">{agent.name}</p>
                    <p className="text-sm text-muted">{agent.type}{agent.team?.name ? ` · ${agent.team.name}` : ''}</p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.14em] ${agent.isActive ? 'bg-emerald-100/10 text-emerald-100' : 'bg-white/5 text-muted'}`}>
                    {agent.isActive ? 'Active' : 'Idle'}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 sm:p-7">
            <p className="text-xs uppercase tracking-spa text-muted">Activity feed</p>
            <h2 className="mt-2 text-2xl font-semibold text-primary">Recent events</h2>
            <div className="mt-5 space-y-3">
              {data.feed.map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/5 bg-background/25 px-4 py-4">
                  <p className="text-sm font-medium text-primary">{formatStatus(item.action)}</p>
                  <p className="mt-1 text-sm text-muted">
                    {(item.actorAgent?.name || item.actorUser?.name || 'System')} · {item.task?.project?.name || 'No project'}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">{formatDate(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return <Card className="p-5"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-primary/10 text-primary">{icon}</div><p className="text-xs uppercase tracking-spa text-muted">{label}</p><p className="mt-3 text-2xl font-semibold text-primary">{value}</p></Card>;
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-white/5 bg-panelAlt px-3 py-3"><p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p><p className="mt-2 text-lg font-semibold text-primary">{value}</p></div>;
}
