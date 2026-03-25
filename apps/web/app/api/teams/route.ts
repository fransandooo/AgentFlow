import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';

export async function GET() {
  const token = cookies().get('agentflow_session')?.value;
  const response = await fetch(`${API_URL}/api/v1/teams`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  const payload = await response.text();
  return new NextResponse(payload, { status: response.status, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request: NextRequest) {
  const token = cookies().get('agentflow_session')?.value;
  const body = await request.json();
  const response = await fetch(`${API_URL}/api/v1/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const payload = await response.text();
  return new NextResponse(payload, { status: response.status, headers: { 'Content-Type': 'application/json' } });
}
