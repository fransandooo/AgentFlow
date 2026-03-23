'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CreateTaskPayload, TaskItem } from '@/lib/types';

export function CreateTaskModal({
  open,
  projectSlug,
  onClose,
  onCreated,
}: {
  open: boolean;
  projectSlug: string;
  onClose: () => void;
  onCreated: (task: TaskItem) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit() {
    setLoading(true);
    const payload: CreateTaskPayload = { title, description, priority };

    const response = await fetch(`/api/projects/${projectSlug}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      onCreated(data.data);
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-xl p-6 sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-spa text-muted">New task</p>
            <h3 className="mt-2 text-2xl font-semibold text-primary">Create task</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-muted hover:text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task"
              className="min-h-32 w-full rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-white outline-none placeholder:text-muted/65 focus:border-primary/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
              className="min-h-12 w-full rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-white outline-none focus:border-primary/40"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button className="bg-transparent text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/10" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={submit} type="button" disabled={loading || !title.trim()}>
            {loading ? 'Creating…' : 'Create task'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
