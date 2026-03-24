'use client';

import { useState } from 'react';
import { Copy, KeyRound, Plus, RefreshCcw } from 'lucide-react';
import { AgentItem, TeamItem } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AgentsManager({ initialAgents, teams }: { initialAgents: AgentItem[]; teams: TeamItem[] }) {
  const [agents, setAgents] = useState<AgentItem[]>(initialAgents || []);
  const [plainKey, setPlainKey] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('coder');
  const [teamId, setTeamId] = useState('');
  const [activity, setActivity] = useState<Record<string, any[]>>({});

  async function createAgent() {
    const response = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, teamId: teamId || undefined }),
    });
    const payload = await response.json();
    if (response.ok) {
      setAgents([payload.data, ...agents]);
      setPlainKey(payload.data.apiKey || null);
      setName('');
      setType('coder');
      setTeamId('');
    }
  }

  async function rotate(id: string) {
    const response = await fetch(`/api/agents/${id}/rotate-key`, { method: 'POST' });
    const payload = await response.json();
    if (response.ok) setPlainKey(payload.data.apiKey || null);
  }

  async function loadActivity(id: string) {
    const response = await fetch(`/api/agents/${id}/activity`);
    const payload = await response.json();
    if (response.ok) setActivity((prev) => ({ ...prev, [id]: payload.data }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="p-6 sm:p-7">
        <p className="text-xs uppercase tracking-spa text-muted">Create agent</p>
        <div className="mt-5 space-y-4">
          <Input placeholder="Agent-Coder-02" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="coder" value={type} onChange={(e) => setType(e.target.value)} />
          <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="min-h-12 w-full rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-white outline-none">
            <option value="">No team</option>
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
          <Button className="w-full gap-2" onClick={createAgent}><Plus className="h-4 w-4" />Create agent</Button>
        </div>

        {plainKey ? (
          <div className="mt-6 rounded-3xl border border-primary/15 bg-primary/10 p-4">
            <p className="text-xs uppercase tracking-spa text-muted">API key shown once</p>
            <div className="mt-3 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate text-sm text-primary">{plainKey}</code>
              <button onClick={() => navigator.clipboard.writeText(plainKey)} className="rounded-full border border-white/10 p-2 text-primary"><Copy className="h-4 w-4" /></button>
            </div>
          </div>
        ) : null}
      </Card>

      <div className="space-y-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">{agent.name}</h3>
                <p className="text-sm text-muted">{agent.type}{agent.team?.name ? ` · ${agent.team.name}` : ''}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">{agent.isActive ? 'Active' : 'Idle'}</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-transparent text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/10" onClick={() => rotate(agent.id)}><KeyRound className="mr-2 h-4 w-4" />Rotate key</Button>
                <Button className="bg-transparent text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/10" onClick={() => loadActivity(agent.id)}><RefreshCcw className="mr-2 h-4 w-4" />Activity</Button>
              </div>
            </div>
            {activity[agent.id]?.length ? (
              <div className="mt-4 space-y-3">
                {activity[agent.id].slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/5 bg-background/25 px-4 py-3 text-sm text-muted">
                    {item.action} · {item.task?.title || 'No task'}
                  </div>
                ))}
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
