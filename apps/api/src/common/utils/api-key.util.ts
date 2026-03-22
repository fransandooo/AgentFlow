import { randomBytes } from 'crypto';

export function generateApiKey(prefix = 'af'): string {
  return `${prefix}_${randomBytes(24).toString('hex')}`;
}
