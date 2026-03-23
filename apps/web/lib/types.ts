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
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assigneeUserId?: string | null;
  assigneeAgentId?: string | null;
  dueDate?: string | null;
  projectId: string;
  createdAt?: string;
  project?: { id: string; slug: string; name: string };
  assigneeUser?: { id: string; name: string } | null;
  assigneeAgent?: { id: string; name: string; type: string } | null;
  _count?: { subtasks: number; comments: number; activityLogs: number };
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: string;
}
