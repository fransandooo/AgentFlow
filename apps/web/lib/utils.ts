export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatStatus(status?: string | null) {
  if (!status) return 'Unknown';
  return status
    .toLowerCase()
    .split('_')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

export function formatPriority(priority?: string | null) {
  if (!priority) return 'Normal';
  return priority.charAt(0) + priority.slice(1).toLowerCase();
}

export function statusTone(status?: string | null) {
  const map: Record<string, string> = {
    BACKLOG: 'bg-slate-100 text-primary border border-border',
    TODO: 'bg-slate-100 text-primary border border-border',
    IN_PROGRESS: 'bg-blue-50 text-accent border border-blue-100',
    REVIEW: 'bg-amber-50 text-warning border border-amber-200',
    DONE: 'bg-emerald-50 text-success border border-emerald-200',
    BLOCKED: 'bg-rose-50 text-danger border border-rose-200',
    CANCELLED: 'bg-slate-100 text-muted border border-border',
  };
  return map[status ?? ''] ?? 'bg-slate-100 text-primary border border-border';
}

export function priorityTone(priority?: string | null) {
  const map: Record<string, string> = {
    LOW: 'text-muted',
    MEDIUM: 'text-accent',
    HIGH: 'text-warning',
    URGENT: 'text-danger',
  };
  return map[priority ?? ''] ?? 'text-muted';
}
