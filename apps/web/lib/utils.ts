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

export function statusColor(status: string) {
  const map: Record<string, string> = {
    BACKLOG: 'bg-slate-700/60 text-slate-200',
    TODO: 'bg-slate-600/60 text-slate-100',
    IN_PROGRESS: 'bg-blue-500/20 text-blue-300',
    REVIEW: 'bg-amber-500/20 text-amber-300',
    DONE: 'bg-emerald-500/20 text-emerald-300',
    BLOCKED: 'bg-red-500/20 text-red-300',
    CANCELLED: 'bg-zinc-700/60 text-zinc-300',
  };
  return map[status] ?? 'bg-slate-700/50 text-slate-200';
}

export function priorityColor(priority?: string | null) {
  const map: Record<string, string> = {
    LOW: 'text-slate-300',
    MEDIUM: 'text-sky-300',
    HIGH: 'text-amber-300',
    URGENT: 'text-rose-300',
  };
  return map[priority ?? ''] ?? 'text-slate-300';
}
