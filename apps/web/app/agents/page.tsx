import { Bot } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { AgentsManager } from '@/components/agents/agents-manager';
import { Card } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

export default async function AgentsPage() {
  const [agentsRes, teamsRes] = await Promise.all([
    apiFetch<any>('/api/v1/agents'),
    apiFetch<any>('/api/v1/teams').catch(() => ({ data: [] })),
  ]);

  return (
    <AppShell>
      <Card className="mb-6 p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/10 bg-primary/10 text-primary"><Bot className="h-5 w-5" /></div>
          <div>
            <p className="text-xs uppercase tracking-spa text-muted">Agents</p>
            <p className="mt-1 text-sm text-muted">Create agents, rotate API keys and inspect recent activity.</p>
          </div>
        </div>
      </Card>
      <AgentsManager initialAgents={agentsRes.data} teams={teamsRes.data || []} />
    </AppShell>
  );
}
