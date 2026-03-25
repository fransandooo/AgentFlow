import { ClipboardList } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { TaskDetail } from '@/components/tasks/task-detail';
import { Card } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

export default async function TaskPage({ params }: { params: { id: string } }) {
  const response = await apiFetch<any>(`/api/v1/tasks/${params.id}`);

  return (
    <AppShell>
      <div className="mb-6">
        <Card className="p-6 sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/10 bg-primary/10 text-primary">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-spa text-muted">Task detail</p>
              <p className="mt-1 text-sm leading-6 text-muted">View full context, notes, activity and ownership with zero clutter.</p>
            </div>
          </div>
        </Card>
      </div>
      <TaskDetail task={response.data} />
    </AppShell>
  );
}
