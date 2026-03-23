import { NextRequest } from 'next/server';

export function getRequestOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin) return origin;

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';

  if (host) return `${proto}://${host}`;

  return request.nextUrl.origin;
}
