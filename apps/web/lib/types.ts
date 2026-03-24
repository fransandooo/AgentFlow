export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string | null;
  _count?: {
    tasks: number;
    customStatuses: number;
  };
}

export interface TaskItem {
  id: string;
  displayId?: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assigneeUserId?: string | null;
  assigneeAgentId?: string | null;
  dueDate?: string | null;
  createdAt?: string;
  projectId: string;
  project?: { id: string; slug: string; name: string };
  assigneeUser?: { id: string; name: string } | null;
  assigneeAgent?: { id: string; name: string; type: string; teamId?: string | null } | null;
  parent?: { id: string; title: string } | null;
  subtaskProgress?: { total: number; done: number };
  _count?: { subtasks: number; comments: number; activityLogs: number };
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: string;
}

export interface AgentItem {
  id: string;
  name: string;
  type: string;
  team?: { id: string; name: string } | null;
  isActive?: boolean;
  lastActivity?: string | null;
  apiKey?: string;
}

export interface TeamItem {
  id: string;
  name: string;
  description?: string | null;
  members?: Array<{ id: string; user?: { id: string; name: string } | null; agent?: { id: string; name: string } | null }>;
}

export interface DashboardData {
  metrics: {
    projects: number;
    tasks: number;
    tasksByStatus: Array<{ status: string; _count: { _all: number } }>;
  };
  projects: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
    description?: string | null;
    taskCount: number;
    inProgress: number;
    blocked: number;
  }>;
  agents: Array<{
    id: string;
    name: string;
    type: string;
    team?: { id: string; name: string } | null;
    isActive: boolean;
    lastActivity?: string | null;
  }>;
  feed: Array<{
    id: string;
    action: string;
    createdAt: string;
    task?: { id: string; title: string; project?: { slug: string; name: string } };
    actorUser?: { id: string; name: string } | null;
    actorAgent?: { id: string; name: string } | null;
  }>;
}
