import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeamDto) {
    const team = await this.prisma.team.create({
      data: dto,
      include: this.teamInclude,
    });
    return { data: team };
  }

  async findAll() {
    const teams = await this.prisma.team.findMany({
      include: this.teamInclude,
      orderBy: { createdAt: 'desc' },
    });
    return { data: teams };
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({ where: { id }, include: this.teamInclude });
    if (!team) throw new NotFoundException(`Team ${id} not found`);
    return { data: team };
  }

  async update(id: string, dto: UpdateTeamDto) {
    await this.findOne(id);
    const team = await this.prisma.team.update({ where: { id }, data: dto, include: this.teamInclude });
    return { data: team };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.team.delete({ where: { id } });
    return { data: { id, deleted: true } };
  }

  async addMember(id: string, dto: AddTeamMemberDto) {
    if ((!dto.userId && !dto.agentId) || (dto.userId && dto.agentId)) {
      throw new BadRequestException('Provide either userId or agentId');
    }

    await this.findOne(id);

    const member = await this.prisma.teamMember.create({
      data: {
        teamId: id,
        userId: dto.userId,
        agentId: dto.agentId,
      },
      include: {
        user: true,
        agent: true,
        team: true,
      },
    });

    return { data: member };
  }

  async removeMember(id: string, memberId: string) {
    await this.findOne(id);
    await this.prisma.teamMember.delete({ where: { id: memberId } });
    return { data: { teamId: id, memberId, deleted: true } };
  }

  private readonly teamInclude = {
    members: {
      include: {
        user: true,
        agent: true,
      },
    },
    agents: true,
  } as const;
}
