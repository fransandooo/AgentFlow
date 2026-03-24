import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateApiKey } from '../common/utils/api-key.util';
import { hashValue } from '../common/utils/hash.util';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAgentDto) {
    const apiKey = generateApiKey('af_agent');
    const apiKeyHash = await hashValue(apiKey);

    const agent = await this.prisma.agent.create({
      data: {
        name: dto.name,
        type: dto.type,
        teamId: dto.teamId,
        isActive: dto.isActive ?? true,
        apiKeyHash,
      },
      include: { team: true },
    });

    return {
      data: {
        ...agent,
        apiKey,
      },
    };
  }

  async findAll() {
    const agents = await this.prisma.agent.findMany({
      include: {
        team: true,
        activityLogs: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: agents.map((agent) => ({
        ...agent,
        lastActivity: agent.activityLogs[0]?.createdAt || null,
      })),
    };
  }

  async findOne(id: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
      include: { team: true },
    });

    if (!agent) {
      throw new NotFoundException(`Agent ${id} not found`);
    }

    return { data: agent };
  }

  async getActivity(id: string) {
    await this.ensureExists(id);

    const items = await this.prisma.activityLog.findMany({
      where: { actorAgentId: id },
      include: {
        task: { include: { project: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { data: items };
  }

  async update(id: string, dto: UpdateAgentDto) {
    await this.ensureExists(id);

    const agent = await this.prisma.agent.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type,
        teamId: dto.teamId,
        isActive: dto.isActive,
      },
      include: { team: true },
    });

    return { data: agent };
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.agent.delete({ where: { id } });
    return { data: { id, deleted: true } };
  }

  async rotateKey(id: string) {
    await this.ensureExists(id);

    const apiKey = generateApiKey('af_agent');
    const apiKeyHash = await hashValue(apiKey);

    await this.prisma.agent.update({
      where: { id },
      data: { apiKeyHash },
    });

    return { data: { id, apiKey } };
  }

  private async ensureExists(id: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });

    if (!agent) {
      throw new NotFoundException(`Agent ${id} not found`);
    }

    return agent;
  }
}
