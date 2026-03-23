import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  cookies().delete('agentflow_session');
  return NextResponse.redirect(new URL('/login', request.url));
}
