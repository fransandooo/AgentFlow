import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestOrigin } from '@/lib/request-url';

export async function POST(request: NextRequest) {
  cookies().delete('agentflow_session');
  return NextResponse.redirect(`${getRequestOrigin(request)}/login`);
}
