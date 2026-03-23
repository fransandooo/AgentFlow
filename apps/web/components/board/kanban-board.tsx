'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { createSocket } from '@/lib/socket';
import { priorityColor, statusColor } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import { TaskItem } from '@/lib/types';

interface Column { id: string; name: string; color?: string; }

export function KanbanBoard({ projectId, initialTasks, columns }: { projectId: string; initialTasks: TaskItem[]; columns: Column[] }) {
  const { boardTasks, setBoardTasks, upsertTask } = useAppStore();

  useEffect(() => {
    setBoardTasks(initialTasks);
  }, [initialTasks, setBoardTasks]);

  useEffect(() => {
    const socket = createSocket();
    socket.emit('join:project', projectId);

    socket.on('task:updated', (payload) => {
      if (payload?.task) upsertTask(payload.task);
    });
    socket.on('task:created', (payload) => {
      if (payload?.task) upsertTask(payload.task);
    });
    socket.on('task:status_changed', (payload) => {
      if (payload?.task) upsertTask(payload.task);
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId, upsertTask]);

  return (
    <div className="grid gap-4 xl:grid-cols-7">
      {columns.map((column) => {
        const tasks = boardTasks.filter((task) => task.status === column.name || task.status === column.id);
        return (
          <div key={column.id} className="min-h-[400px] rounded-2xl border border-border bg-panelAlt/70 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{column.name}</p>
                <p className="text-xs text-muted">{tasks.length} tarjetas</p>
              </div>
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: column.color || '#7c3aed' }} />
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <Card className="p-3 transition hover:border-primary hover:bg-background/60">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white">{task.title}</p>
                      <Badge className={statusColor(task.status)}>{task.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className={priorityColor(task.priority)}>{task.priority}</span>
                      <span>•</span>
                      <span>{task.assigneeAgent?.name || task.assigneeUser?.name || 'Sin asignar'}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
