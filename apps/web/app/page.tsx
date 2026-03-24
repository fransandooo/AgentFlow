import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';
import { DashboardLive } from '@/components/dashboard/dashboard-live';

export default async function DashboardPage() {
  const dashboard = await apiFetch<any>('/api/v1/dashboard');

  return (
    <AppShell>
      <Card className="mb-8 p-7 sm:p-8">
        <p className="text-xs uppercase tracking-spa text-muted">Executive overview</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">Realtime command center</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-[15px]">
          Métricas agregadas, actividad reciente y estado operativo de agentes actualizados en vivo.
        </p>
      </Card>
      <DashboardLive initialData={dashboard.data} />
    </AppShell>
  );
}
