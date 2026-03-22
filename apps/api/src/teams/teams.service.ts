import { Injectable } from '@nestjs/common';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  create(dto: CreateTeamDto) { return { data: dto }; }
  findAll() { return { data: [] }; }
  findOne(id: string) { return { data: { id } }; }
  update(id: string, dto: UpdateTeamDto) { return { data: { id, ...dto } }; }
  remove(id: string) { return { data: { id, deleted: true } }; }
  addMember(id: string, dto: AddTeamMemberDto) { return { data: { teamId: id, ...dto } }; }
  removeMember(id: string, memberId: string) { return { data: { teamId: id, memberId, deleted: true } }; }
}
