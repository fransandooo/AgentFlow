import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md p-8 shadow-glow">
        <div className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary">AgentFlow</p>
          <h1 className="text-3xl font-semibold">Entrar</h1>
          <p className="mt-2 text-sm text-muted">Accede al panel de control y al board en tiempo real.</p>
        </div>

        <form action="/api/auth/login" method="post" className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <Input name="email" type="email" placeholder="tu@email.com" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <Input name="password" type="password" placeholder="••••••••" required />
          </div>

          {searchParams?.error ? <p className="text-sm text-red-300">Login fallido. Revisa email y password.</p> : null}

          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </Card>
    </div>
  );
}
