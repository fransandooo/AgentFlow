import { IsHexColor, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  slug!: string;

  @IsHexColor()
  color!: string;

  @IsUUID()
  ownerId!: string;
}
