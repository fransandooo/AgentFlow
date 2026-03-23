import { AppShell } from '@/components/layout/app-shell';
import { TaskDetail } from '@/components/tasks/task-detail';
import { apiFetch } from '@/lib/api';

export default async function TaskPage({ params }: { params: { id: string } }) {
  const response = await apiFetch<any>(`/api/v1/tasks/${params.id}`);

  return (
    <AppShell>
      <TaskDetail task={response.data} />
    </AppShell>
  );
}
