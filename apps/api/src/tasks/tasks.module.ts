import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [ActivityModule, WebsocketModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
