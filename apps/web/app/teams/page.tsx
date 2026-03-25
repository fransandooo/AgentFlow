import { Users } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { TeamsManager } from '@/components/teams/teams-manager';
import { Card } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

export default async function TeamsPage() {
  const [teamsRes, agentsRes] = await Promise.all([
    apiFetch<any>('/api/v1/teams').catch(() => ({ data: [] })),
    apiFetch<any>('/api/v1/agents').catch(() => ({ data: [] })),
  ]);

  return (
    <AppShell>
      <Card className="mb-6 p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/10 bg-primary/10 text-primary"><Users className="h-5 w-5" /></div>
          <div>
            <p className="text-xs uppercase tracking-spa text-muted">Teams</p>
            <p className="mt-1 text-sm text-muted">Create teams, assign members and use them to filter boards.</p>
          </div>
        </div>
      </Card>
      <TeamsManager initialTeams={teamsRes.data || []} agents={agentsRes.data || []} />
    </AppShell>
  );
}
