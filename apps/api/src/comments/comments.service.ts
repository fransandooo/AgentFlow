import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  create(taskId: string, dto: CreateCommentDto) { return { data: { taskId, ...dto } }; }
  findAll(taskId: string) { return { data: { taskId, items: [] } }; }
  remove(id: string) { return { data: { id, deleted: true } }; }
}
