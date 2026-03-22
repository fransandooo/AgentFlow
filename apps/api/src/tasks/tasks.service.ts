import { Injectable } from '@nestjs/common';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  create(slug: string, dto: CreateTaskDto) { return { data: { projectSlug: slug, ...dto } }; }
  findAll(slug: string, query: ListTasksDto) { return { data: { projectSlug: slug, filters: query, items: [] } }; }
  findOne(id: string) { return { data: { id, subtasks: [], comments: [], activity: [] } }; }
  update(id: string, dto: UpdateTaskDto) { return { data: { id, ...dto } }; }
  remove(id: string) { return { data: { id, deleted: true } }; }
  updateStatus(id: string, dto: UpdateTaskStatusDto) { return { data: { id, ...dto } }; }
  createSubtask(id: string, dto: CreateSubtaskDto) { return { data: { parentId: id, ...dto } }; }
  getActivity(id: string) { return { data: { taskId: id, items: [] } }; }
}
