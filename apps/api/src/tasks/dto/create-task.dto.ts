import { GlobalTaskStatus, TaskPriority } from '@agentflow/types';
import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(GlobalTaskStatus)
  status?: GlobalTaskStatus;

  @IsOptional()
  @IsUUID()
  customStatusId?: string;

  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsOptional()
  @IsUUID()
  assigneeUserId?: string;

  @IsOptional()
  @IsUUID()
  assigneeAgentId?: string;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;
}
