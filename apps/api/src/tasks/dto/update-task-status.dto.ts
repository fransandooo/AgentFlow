import { GlobalTaskStatus } from '@agentflow/types';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(GlobalTaskStatus)
  status!: GlobalTaskStatus;

  @IsOptional()
  @IsUUID()
  customStatusId?: string;
}
