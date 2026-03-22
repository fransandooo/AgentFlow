import { IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class AddTeamMemberDto {
  @ValidateIf((o: AddTeamMemberDto) => !o.agentId)
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ValidateIf((o: AddTeamMemberDto) => !o.userId)
  @IsUUID()
  @IsOptional()
  agentId?: string;
}
