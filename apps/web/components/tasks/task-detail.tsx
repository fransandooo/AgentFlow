'use client';

import { useState } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, FolderOpen, ListChecks, MessageSquareText, Plus, TimerReset, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate, formatPriority, formatStatus, priorityTone, statusTone } from '@/lib/utils';

export function TaskDetail({ task }: { task: any }) {
  const [subtasksOpen, setSubtasksOpen] = useState(true);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [title, setTitle] = useState('');

  async function createSubtask() {
    const response = await fetch(`/api/tasks/${task.id}/subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority: task.priority }),
    });
    const payload = await response.json();
    if (response.ok) {
      setSubtasks([...subtasks, payload.data]);
      setTitle('');
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge className={statusTone(task.status)}>{formatStatus(task.status)}</Badge>
            <Badge className={`bg-white/5 ring-1 ring-inset ring-white/10 ${priorityTone(task.priority)}`}>{formatPriority(task.priority)}</Badge>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-primary">{task.title}</h1>
            <p className="whitespace-pre-wrap text-[15px] leading-8 text-muted">{task.description || 'No description has been written for this task yet.'}</p>
          </div>
        </Card>

        <SectionCard icon={<ListChecks className="h-5 w-5" />} title="Subtasks" action={<button onClick={() => setSubtasksOpen(!subtasksOpen)} className="text-muted">{subtasksOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>}>
          <div className="flex gap-3">
            <Input placeholder="New subtask title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Button onClick={createSubtask}><Plus className="h-4 w-4" /></Button>
          </div>
          {subtasksOpen ? (subtasks.length ? subtasks.map((subtask: any) => (
            <div key={subtask.id} className="rounded-3xl border border-white/5 bg-background/30 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-primary">{subtask.title}</p>
                <Badge className={statusTone(subtask.status)}>{formatStatus(subtask.status)}</Badge>
              </div>
            </div>
          )) : <EmptyState text="No subtasks yet." />) : null}
        </SectionCard>

        <SectionCard icon={<MessageSquareText className="h-5 w-5" />} title="Comments">
          {task.comments?.length ? task.comments.map((comment: any) => (
            <div key={comment.id} className="rounded-3xl border border-white/5 bg-background/30 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">{comment.authorUser?.name || comment.authorAgent?.name || 'System'} · {formatDate(comment.createdAt)}</p>
              <p className="mt-3 text-sm leading-7 text-primary">{comment.content}</p>
            </div>
          )) : <EmptyState text="No comments yet." />}
        </SectionCard>

        <SectionCard icon={<TimerReset className="h-5 w-5" />} title="Activity log">
          {task.activityLogs?.length ? task.activityLogs.map((log: any) => (
            <div key={log.id} className="rounded-3xl border border-white/5 bg-background/30 px-5 py-4">
              <p className="text-sm font-medium text-primary">{formatStatus(log.action)}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">{formatDate(log.createdAt)}</p>
            </div>
          )) : <EmptyState text="No activity recorded yet." />}
        </SectionCard>
      </div>

      <div>
        <Card className="sticky top-28 p-6 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-primary/10 text-primary"><FolderOpen className="h-5 w-5" /></div>
            <div><p className="text-xs uppercase tracking-spa text-muted">Task context</p><h2 className="text-xl font-semibold tracking-tight text-primary">Metadata</h2></div>
          </div>
          <dl className="space-y-5 text-sm">
            <MetaRow icon={<FolderOpen className="h-4 w-4" />} label="Project" value={task.project?.name || '—'} />
            <MetaRow icon={<UserRound className="h-4 w-4" />} label="Assigned to" value={task.assigneeAgent?.name || task.assigneeUser?.name || 'Unassigned'} />
            <MetaRow icon={<CalendarDays className="h-4 w-4" />} label="Due date" value={formatDate(task.dueDate)} />
            <MetaRow icon={<TimerReset className="h-4 w-4" />} label="Created" value={formatDate(task.createdAt)} />
          </dl>
        </Card>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, children, action }: { icon: React.ReactNode; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <Card className="p-6 sm:p-7"><div className="mb-5 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-panelAlt text-primary">{icon}</div><h2 className="text-xl font-semibold tracking-tight text-primary">{title}</h2></div>{action}</div><div className="space-y-4">{children}</div></Card>;
}
function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex items-start gap-4 rounded-3xl border border-white/5 bg-background/25 px-4 py-4"><div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-panelAlt text-primary">{icon}</div><div><dt className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</dt><dd className="mt-1 text-sm leading-6 text-primary">{value}</dd></div></div>; }
function EmptyState({ text }: { text: string }) { return <p className="rounded-3xl border border-dashed border-white/10 px-5 py-5 text-sm text-muted">{text}</p>; }
