import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/ws', cors: true })
export class EventsGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('join:project')
  handleJoinProject(@MessageBody() projectId: string) {
    return { event: 'joined', data: { projectId } };
  }

  emitTaskUpdated(payload: unknown) {
    this.server.emit('task:updated', payload);
  }
}
