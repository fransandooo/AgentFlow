import { GlobalTaskStatus, TaskPriority } from '@agentflow/types';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class ListTasksDto {
  @IsOptional()
  @IsEnum(GlobalTaskStatus)
  status?: GlobalTaskStatus;

  @IsOptional()
  @IsUUID()
  assigneeUserId?: string;

  @IsOptional()
  @IsUUID()
  assigneeAgentId?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
