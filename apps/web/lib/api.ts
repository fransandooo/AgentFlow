import { cookies } from 'next/headers';
import { API_URL } from './config';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = cookies().get('agentflow_session')?.value;

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}
