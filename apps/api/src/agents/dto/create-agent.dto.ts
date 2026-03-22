import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
