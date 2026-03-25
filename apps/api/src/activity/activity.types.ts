export interface ActivityLogJobData {
  taskId: string;
  action: string;
  actorUserId?: string;
  actorAgentId?: string;
  metadata: Record<string, unknown>;
}

export interface AgentActivityEvent {
  agentId: string;
  taskId: string;
  action: string;
  metadata?: Record<string, unknown>;
}
