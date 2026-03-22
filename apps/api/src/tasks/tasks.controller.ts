import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('projects/:slug/tasks')
  create(@Param('slug') slug: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(slug, dto);
  }

  @Get('projects/:slug/tasks')
  findAll(@Param('slug') slug: string, @Query() query: ListTasksDto) {
    return this.tasksService.findAll(slug, query);
  }

  @Get('tasks/:id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch('tasks/:id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete('tasks/:id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Patch('tasks/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto) {
    return this.tasksService.updateStatus(id, dto);
  }

  @Post('tasks/:id/subtasks')
  createSubtask(@Param('id') id: string, @Body() dto: CreateSubtaskDto) {
    return this.tasksService.createSubtask(id, dto);
  }

  @Get('tasks/:id/activity')
  getActivity(@Param('id') id: string) {
    return this.tasksService.getActivity(id);
  }
}
