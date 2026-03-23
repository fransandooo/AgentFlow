import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.redirect(new URL('/login?error=1', request.url));
  }

  const payload = await response.json();
  const accessToken = payload?.data?.accessToken;

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login?error=1', request.url));
  }

  cookies().set('agentflow_session', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  });

  return NextResponse.redirect(new URL('/', request.url));
}
