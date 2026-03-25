import { IsOptional, IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class CreateSubtaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
