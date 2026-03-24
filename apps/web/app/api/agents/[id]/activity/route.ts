import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const token = cookies().get('agentflow_session')?.value;
  const response = await fetch(`${API_URL}/api/v1/agents/${params.id}/activity`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  const payload = await response.text();
  return new NextResponse(payload, { status: response.status, headers: { 'Content-Type': 'application/json' } });
}
