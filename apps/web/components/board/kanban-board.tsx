'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, GripVertical, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreateTaskModal } from '@/components/board/create-task-modal';
import { createSocket } from '@/lib/socket';
import { formatPriority, formatStatus, priorityTone } from '@/lib/utils';
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
  const scrollerRef = useRef<HTMLDivElement | null>(null);

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
    if (payload?.data) upsertTask(payload.data);

    setDraggedTaskId(null);
    setSavingTaskId(null);
  }

  function scrollByAmount(direction: 'left' | 'right') {
    scrollerRef.current?.scrollBy({
      left: direction === 'left' ? -380 : 380,
      behavior: 'smooth',
    });
  }

  function scrollToColumn(columnId: string) {
    document.getElementById(`column-${columnId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between xl:flex-1">
          <p className="text-sm leading-7 text-muted">Move through the board sideways and drag cards between columns.</p>
          <div className="flex flex-wrap items-center gap-2">
            {normalizedColumns.map((column) => (
              <button
                key={column.id}
                type="button"
                onClick={() => scrollToColumn(column.id)}
                className="rounded-[4px] border border-border bg-panelAlt px-3 py-2 text-xs uppercase tracking-[0.12em] text-muted transition hover:text-primary"
              >
                {formatStatus(column.name)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start xl:self-auto">
          <Button className="bg-panelAlt px-3 text-primary hover:bg-panelAlt" onClick={() => scrollByAmount('left')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button className="bg-panelAlt px-3 text-primary hover:bg-panelAlt" onClick={() => scrollByAmount('right')}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button className="gap-2" onClick={() => setCreatingTask(true)}>
            <Plus className="h-4 w-4" /> New task
          </Button>
        </div>
      </div>

      <div ref={scrollerRef} className="overflow-x-auto pb-3">
        <div className="grid min-w-max grid-flow-col auto-cols-[340px] gap-5 pr-4">
          {normalizedColumns.map((column) => {
            const tasks = boardTasks.filter((task) => normalizeStatus(task.status) === column.normalizedStatus);
            return (
              <section
                id={`column-${column.id}`}
                key={column.id}
                className="rounded-[6px] border border-border bg-panelAlt p-4 shadow-panel"
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(column.normalizedStatus)}
              >
                <div className="mb-5 flex items-center justify-between gap-3 px-1">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold tracking-tight text-primary">{formatStatus(column.name)}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-muted">{tasks.length} items</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" style={{ backgroundColor: column.color || '#3A5A80' }} />
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
                        <Card className="group min-h-[224px] p-4 transition duration-200 hover:border-accent/30">
                          <div className="flex h-full flex-col justify-between gap-5">
                            <div className="space-y-3">
                              {task.parent?.title ? (
                                <div className="rounded-[4px] border border-border bg-panelAlt px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-muted">
                                  Subtask of · {task.parent.title}
                                </div>
                              ) : null}

                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2 text-muted">
                                  <GripVertical className="h-4 w-4" />
                                  <span className="text-[11px] uppercase tracking-[0.16em] text-muted">{task.displayId || task.id.slice(0, 8)}</span>
                                </div>
                                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-hover:text-primary" />
                              </div>

                              <div className="space-y-2">
                                <p className="text-base font-medium leading-6 text-primary">{task.title}</p>
                                <p className="line-clamp-3 text-sm leading-6 text-muted">{task.description || 'No extra context yet.'}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                <Badge className={`bg-slate-100 ${priorityTone(task.priority)}`}>{formatPriority(task.priority)}</Badge>
                                {savingTaskId === task.id ? <Badge className="bg-blue-50 text-accent border border-blue-100">Saving</Badge> : null}
                                {task.subtaskProgress?.total ? (
                                  <Badge className="bg-slate-100 text-muted border border-border">
                                    {task.subtaskProgress.done}/{task.subtaskProgress.total} done
                                  </Badge>
                                ) : null}
                              </div>

                              <div className="flex items-center justify-between gap-3">
                                <div className="inline-flex items-center gap-2 rounded-[6px] border border-border bg-panelAlt px-2 py-2 pr-3 text-primary">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                                    {ownerInitials(task)}
                                  </div>
                                  <span className="max-w-[132px] truncate text-xs text-muted">
                                    {task.assigneeAgent?.name || task.assigneeUser?.name || 'Unassigned'}
                                  </span>
                                </div>
                              </div>
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

function normalizeStatus(value: string) {
  return value.toUpperCase().replace(/\s+/g, '_');
}

function ownerInitials(task: TaskItem) {
  const name = task.assigneeAgent?.name || task.assigneeUser?.name;
  if (!name) return 'NA';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() || '')
    .join('');
}
