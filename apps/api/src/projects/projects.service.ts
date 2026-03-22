import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  create(dto: CreateProjectDto) { return { data: dto }; }
  findAll() { return { data: [] }; }
  findOne(slug: string) { return { data: { slug } }; }
  update(slug: string, dto: UpdateProjectDto) { return { data: { slug, ...dto } }; }
  remove(slug: string) { return { data: { slug, deleted: true } }; }
  getBoard(slug: string) { return { data: { slug, columns: [], tasks: [] } }; }
}
