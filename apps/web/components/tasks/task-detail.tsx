import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDate, priorityColor, statusColor } from '@/lib/utils';

export function TaskDetail({ task }: { task: any }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Badge className={statusColor(task.status)}>{task.status}</Badge>
            <span className={`text-sm font-medium ${priorityColor(task.priority)}`}>{task.priority}</span>
          </div>
          <h1 className="text-2xl font-semibold">{task.title}</h1>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{task.description || 'Sin descripción'}</p>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Subtareas</h2>
          <div className="space-y-3">
            {task.subtasks?.length ? task.subtasks.map((subtask: any) => (
              <div key={subtask.id} className="rounded-xl border border-border bg-background/40 p-3">
                <p className="font-medium">{subtask.title}</p>
                <p className="mt-1 text-sm text-muted">{subtask.status}</p>
              </div>
            )) : <p className="text-sm text-muted">No hay subtareas.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Comentarios</h2>
          <div className="space-y-3">
            {task.comments?.length ? task.comments.map((comment: any) => (
              <div key={comment.id} className="rounded-xl border border-border bg-background/40 p-3">
                <p className="text-xs text-muted">{comment.authorUser?.name || comment.authorAgent?.name || 'Sistema'} · {formatDate(comment.createdAt)}</p>
                <p className="mt-2 text-sm text-slate-200">{comment.content}</p>
              </div>
            )) : <p className="text-sm text-muted">Sin comentarios.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Actividad</h2>
          <div className="space-y-3">
            {task.activityLogs?.length ? task.activityLogs.map((log: any) => (
              <div key={log.id} className="rounded-xl border border-border bg-background/40 p-3">
                <p className="text-sm font-medium">{log.action}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(log.createdAt)}</p>
              </div>
            )) : <p className="text-sm text-muted">Sin actividad registrada.</p>}
          </div>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24 p-6">
          <h2 className="mb-4 text-lg font-semibold">Metadata</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted">Proyecto</dt>
              <dd className="mt-1">{task.project?.name || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted">Asignado a</dt>
              <dd className="mt-1">{task.assigneeAgent?.name || task.assigneeUser?.name || 'Sin asignar'}</dd>
            </div>
            <div>
              <dt className="text-muted">Due date</dt>
              <dd className="mt-1">{formatDate(task.dueDate)}</dd>
            </div>
            <div>
              <dt className="text-muted">Creada</dt>
              <dd className="mt-1">{formatDate(task.createdAt)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
