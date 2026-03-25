import { io } from 'socket.io-client';
import { WS_URL } from './config';

export function createSocket() {
  return io(WS_URL.replace(/\/ws$/, ''), {
    path: '/socket.io',
    transports: ['websocket'],
  });
}
