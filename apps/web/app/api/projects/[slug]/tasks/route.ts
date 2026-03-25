import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  const token = cookies().get('agentflow_session')?.value;
  const body = await request.json();

  const response = await fetch(`${API_URL}/api/v1/projects/${params.slug}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const payload = await response.text();
  return new NextResponse(payload, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
