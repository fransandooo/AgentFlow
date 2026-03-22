import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('tasks/:id/comments')
  create(@Param('id') id: string, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(id, dto);
  }

  @Get('tasks/:id/comments')
  findAll(@Param('id') id: string) {
    return this.commentsService.findAll(id);
  }

  @Delete('comments/:id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
