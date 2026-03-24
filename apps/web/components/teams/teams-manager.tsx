'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2, UserPlus } from 'lucide-react';
import { AgentItem, TeamItem } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TeamsManager({ initialTeams, agents }: { initialTeams: TeamItem[]; agents: AgentItem[] }) {
  const [teams, setTeams] = useState<TeamItem[]>(initialTeams);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Record<string, { name: string; description: string }>>({});

  async function refreshTeams() {
    const refresh = await fetch('/api/teams');
    const payload = await refresh.json();
    setTeams(payload.data || []);
  }

  async function createTeam() {
    const response = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (response.ok) {
      setName(''); setDescription(''); await refreshTeams();
    }
  }

  async function addAgent(teamId: string) {
    const agentId = selectedAgent[teamId];
    if (!agentId) return;
    const response = await fetch(`/api/teams/${teamId}/members`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agentId }),
    });
    if (response.ok) await refreshTeams();
  }

  async function saveTeam(teamId: string) {
    const team = editing[teamId];
    const response = await fetch(`/api/teams/${teamId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(team),
    });
    if (response.ok) await refreshTeams();
  }

  async function deleteTeam(teamId: string) {
    const response = await fetch(`/api/teams/${teamId}`, { method: 'DELETE' });
    if (response.ok) await refreshTeams();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="p-6 sm:p-7">
        <p className="text-xs uppercase tracking-spa text-muted">Create team</p>
        <div className="mt-5 space-y-4">
          <Input placeholder="Platform" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Team description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button className="w-full gap-2" onClick={createTeam}><Plus className="h-4 w-4" />Create team</Button>
        </div>
      </Card>

      <div className="space-y-4">
        {teams.map((team) => {
          const current = editing[team.id] || { name: team.name, description: team.description || '' };
          return (
            <Card key={team.id} className="p-6">
              <div className="space-y-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]">
                  <Input value={current.name} onChange={(e) => setEditing((prev) => ({ ...prev, [team.id]: { ...current, name: e.target.value } }))} />
                  <Input value={current.description} onChange={(e) => setEditing((prev) => ({ ...prev, [team.id]: { ...current, description: e.target.value } }))} />
                  <Button className="gap-2 bg-transparent text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/10" onClick={() => saveTeam(team.id)}><Pencil className="h-4 w-4" />Save</Button>
                  <Button className="gap-2 bg-transparent text-rose-200 ring-1 ring-inset ring-rose-200/20 hover:bg-rose-200/10" onClick={() => deleteTeam(team.id)}><Trash2 className="h-4 w-4" />Delete</Button>
                </div>

                <div className="flex gap-2">
                  <select value={selectedAgent[team.id] || ''} onChange={(e) => setSelectedAgent((prev) => ({ ...prev, [team.id]: e.target.value }))} className="min-h-11 rounded-2xl border border-border bg-panelAlt px-4 py-2 text-sm text-white outline-none">
                    <option value="">Select agent</option>
                    {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                  </select>
                  <Button className="gap-2" onClick={() => addAgent(team.id)}><UserPlus className="h-4 w-4" />Add agent</Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {team.members?.map((member) => (
                    <span key={member.id} className="rounded-full border border-white/5 bg-background/25 px-3 py-2 text-sm text-muted">
                      {member.agent?.name || member.user?.name}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
