import { LockKeyhole, Mail, PanelTop } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full max-w-[460px] p-7 sm:p-10">
        <div className="mb-8 space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/15 bg-primary/10 text-primary">
            <PanelTop className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-spa text-muted">Private workspace</p>
            <h1 className="text-3xl font-semibold tracking-tight text-primary">Welcome back</h1>
            <p className="text-sm leading-6 text-muted">
              Entra en una interfaz sobria, precisa y pensada para trabajo serio sin fricción visual.
            </p>
          </div>
        </div>

        <form action="/api/auth/login" method="post" className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm text-muted">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input name="email" type="email" placeholder="admin@agentflow.com" className="pl-11" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted">Password</label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input name="password" type="password" placeholder="••••••••" className="pl-11" required />
            </div>
          </div>

          {searchParams?.error ? (
            <p className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              Login fallido. Revisa email y password.
            </p>
          ) : null}

          <Button type="submit" className="w-full justify-center">Enter workspace</Button>
        </form>
      </Card>
    </div>
  );
}
