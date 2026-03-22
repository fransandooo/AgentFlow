import { Injectable } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  create(dto: CreateAgentDto) {
    return { data: { ...dto, apiKey: 'plain-key-once-only-pending' } };
  }

  findAll() {
    return { data: [] };
  }

  findOne(id: string) {
    return { data: { id } };
  }

  update(id: string, dto: UpdateAgentDto) {
    return { data: { id, ...dto } };
  }

  remove(id: string) {
    return { data: { id, deleted: true } };
  }

  rotateKey(id: string) {
    return { data: { id, apiKey: 'rotated-key-once-only-pending' } };
  }
}
