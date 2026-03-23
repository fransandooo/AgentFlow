'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CircleEllipsis,
  CircleOff,
  GripVertical,
  LoaderCircle,
  Plus,
  ShieldAlert,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreateTaskModal } from '@/components/board/create-task-modal';
import { createSocket } from '@/lib/socket';
import { formatPriority, formatStatus, priorityTone, statusTone } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import { TaskItem } from '@/lib/types';

interface Column {
  id: string;
  name: string;
  color?: string;
}

export function KanbanBoard({
  projectId,
  projectSlug,
  initialTasks,
  columns,
}: {
  projectId: string;
  projectSlug: string;
  initialTasks: TaskItem[];
  columns: Column[];
}) {
  const { boardTasks, setBoardTasks, upsertTask, moveTaskStatus, isCreatingTask, setCreatingTask } = useAppStore();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);

  useEffect(() => {
    setBoardTasks(initialTasks);
  }, [initialTasks, setBoardTasks]);

  useEffect(() => {
    const socket = createSocket();
    socket.emit('join:project', projectId);

    socket.on('task:updated', (payload) => payload?.task && upsertTask(payload.task));
    socket.on('task:created', (payload) => payload?.task && upsertTask(payload.task));
    socket.on('task:status_changed', (payload) => payload?.task && upsertTask(payload.task));

    return () => {
      socket.disconnect();
    };
  }, [projectId, upsertTask]);

  const normalizedColumns = useMemo(
    () => columns.map((column) => ({ ...column, normalizedStatus: normalizeStatus(column.id || column.name) })),
    [columns],
  );

  async function handleDrop(nextStatus: string) {
    if (!draggedTaskId) return;
    setSavingTaskId(draggedTaskId);
    moveTaskStatus(draggedTaskId, nextStatus);

    const response = await fetch(`/api/tasks/${draggedTaskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });

    const payload = await response.json().catch(() => null);
    if (payload?.data) {
      upsertTask(payload.data);
    }

    setDraggedTaskId(null);
    setSavingTaskId(null);
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm leading-7 text-muted">Drag cards between columns to update the task state instantly.</p>
        </div>
        <Button className="gap-2" onClick={() => setCreatingTask(true)}>
          <Plus className="h-4 w-4" /> New task
        </Button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1120px] gap-5 xl:grid-cols-4 2xl:grid-cols-7">
          {normalizedColumns.map((column) => {
            const tasks = boardTasks.filter((task) => normalizeStatus(task.status) === column.normalizedStatus);
            return (
              <section
                key={column.id}
                className="rounded-[28px] border border-white/5 bg-panelAlt/70 p-4 shadow-panel"
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(column.normalizedStatus)}
              >
                <div className="mb-5 flex items-center justify-between gap-3 px-1">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold tracking-tight text-primary">{formatStatus(column.name)}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-muted">{tasks.length} items</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-primary/80" style={{ backgroundColor: column.color || '#e9dfd1' }} />
                </div>

                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDraggedTaskId(task.id)}
                      onDragEnd={() => setDraggedTaskId(null)}
                    >
                      <Link href={`/tasks/${task.id}`}>
                        <Card className="group p-5 transition duration-200 hover:border-primary/20 hover:bg-background/40">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-muted">
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <div className="space-y-2">
                                  <p className="text-base font-medium leading-6 text-primary transition group-hover:text-white">
                                    {task.title}
                                  </p>
                                  <p className="line-clamp-2 text-sm leading-6 text-muted">
                                    {task.description || 'No extra context yet.'}
                                  </p>
                                </div>
                              </div>
                              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition group-hover:text-primary" />
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge className={statusTone(task.status)}>{formatStatus(task.status)}</Badge>
                              <Badge className={`bg-white/5 ring-1 ring-inset ring-white/10 ${priorityTone(task.priority)}`}>
                                {formatPriority(task.priority)}
                              </Badge>
                              {savingTaskId === task.id ? (
                                <Badge className="bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">Saving</Badge>
                              ) : null}
                            </div>

                            <div className="grid gap-3 rounded-3xl border border-white/5 bg-background/20 p-4 text-sm sm:grid-cols-2">
                              <InfoRow icon={statusIcon(task.status)} label="State" value={formatStatus(task.status)} />
                              <InfoRow icon={<UserRound className="h-4 w-4" />} label="Owner" value={task.assigneeAgent?.name || task.assigneeUser?.name || 'Unassigned'} />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <CreateTaskModal
        open={isCreatingTask}
        projectSlug={projectSlug}
        onClose={() => setCreatingTask(false)}
        onCreated={upsertTask}
      />
    </>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-panel text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="truncate text-sm text-primary">{value}</p>
      </div>
    </div>
  );
}

function statusIcon(status: string) {
  switch (status) {
    case 'IN_PROGRESS':
      return <LoaderCircle className="h-4 w-4" />;
    case 'BLOCKED':
      return <ShieldAlert className="h-4 w-4" />;
    case 'DONE':
      return <Sparkles className="h-4 w-4" />;
    case 'REVIEW':
      return <CircleEllipsis className="h-4 w-4" />;
    default:
      return <CircleOff className="h-4 w-4" />;
  }
}

function normalizeStatus(value: string) {
  return value.toUpperCase().replace(/\s+/g, '_');
}
