import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AgentActivityEvent } from '../activity/activity.types';
import { GLOBAL_ROOM, projectRoom } from '../redis/redis.constants';

@WebSocketGateway({ namespace: '/ws', cors: true })
export class EventsGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('join:project')
  handleJoinProject(@ConnectedSocket() client: Socket, @MessageBody() projectId: string) {
    client.join(projectRoom(projectId));
    return { event: 'joined:project', data: { room: projectRoom(projectId), projectId } };
  }

  @SubscribeMessage('join:global')
  handleJoinGlobal(@ConnectedSocket() client: Socket) {
    client.join(GLOBAL_ROOM);
    return { event: 'joined:global', data: { room: GLOBAL_ROOM } };
  }

  emitTaskUpdated(projectId: string, payload: unknown) {
    this.server.to(projectRoom(projectId)).emit('task:updated', payload);
    this.server.to(GLOBAL_ROOM).emit('task:updated', payload);
  }

  emitTaskStatusChanged(projectId: string, payload: unknown) {
    this.server.to(projectRoom(projectId)).emit('task:status_changed', payload);
    this.server.to(GLOBAL_ROOM).emit('task:status_changed', payload);
  }

  emitTaskCreated(projectId: string, payload: unknown) {
    this.server.to(projectRoom(projectId)).emit('task:created', payload);
    this.server.to(GLOBAL_ROOM).emit('task:created', payload);
  }

  emitTaskAssigned(projectId: string, payload: unknown) {
    this.server.to(projectRoom(projectId)).emit('task:assigned', payload);
    this.server.to(GLOBAL_ROOM).emit('task:assigned', payload);
  }

  emitTaskCommentAdded(projectId: string, payload: unknown) {
    this.server.to(projectRoom(projectId)).emit('task:comment_added', payload);
    this.server.to(GLOBAL_ROOM).emit('task:comment_added', payload);
  }

  emitAgentActivity(projectId: string, payload: AgentActivityEvent) {
    this.server.to(projectRoom(projectId)).emit('agent:activity', payload);
    this.server.to(GLOBAL_ROOM).emit('agent:activity', payload);
  }
}
