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
    BACKLOG: 'bg-stone-200/8 text-stone-200 ring-1 ring-inset ring-stone-100/10',
    TODO: 'bg-stone-200/8 text-stone-50 ring-1 ring-inset ring-stone-100/10',
    IN_PROGRESS: 'bg-stone-100/10 text-stone-50 ring-1 ring-inset ring-stone-100/15',
    REVIEW: 'bg-amber-100/10 text-amber-50 ring-1 ring-inset ring-amber-100/15',
    DONE: 'bg-emerald-100/10 text-emerald-50 ring-1 ring-inset ring-emerald-100/15',
    BLOCKED: 'bg-rose-100/10 text-rose-50 ring-1 ring-inset ring-rose-100/15',
    CANCELLED: 'bg-zinc-100/10 text-zinc-300 ring-1 ring-inset ring-zinc-100/10',
  };
  return map[status ?? ''] ?? 'bg-stone-200/8 text-stone-50 ring-1 ring-inset ring-stone-100/10';
}

export function priorityTone(priority?: string | null) {
  const map: Record<string, string> = {
    LOW: 'text-stone-300',
    MEDIUM: 'text-stone-100',
    HIGH: 'text-amber-100',
    URGENT: 'text-rose-100',
  };
  return map[priority ?? ''] ?? 'text-stone-300';
}
