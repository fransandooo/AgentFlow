import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GlobalTaskStatus } from '@agentflow/types';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        slug: dto.slug,
        color: dto.color,
        ownerId: dto.ownerId,
      },
    });

    return { data: project };
  }

  async findAll() {
    const projects = await this.prisma.project.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
            customStatuses: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return { data: projects };
  }

  async findOne(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        owner: true,
        customStatuses: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${slug} not found`);
    }

    return { data: project };
  }

  async update(slug: string, dto: UpdateProjectDto) {
    await this.ensureExists(slug);

    const project = await this.prisma.project.update({
      where: { slug },
      data: {
        name: dto.name,
        description: dto.description,
        slug: dto.slug,
        color: dto.color,
        ownerId: dto.ownerId,
      },
    });

    return { data: project };
  }

  async remove(slug: string) {
    await this.ensureExists(slug);
    await this.prisma.project.delete({ where: { slug } });
    return { data: { slug, deleted: true } };
  }

  async getBoard(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        customStatuses: { orderBy: { order: 'asc' } },
        tasks: {
          include: {
            assigneeUser: true,
            assigneeAgent: true,
            _count: { select: { subtasks: true } },
          },
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${slug} not found`);
    }

    const defaultColumns = Object.values(GlobalTaskStatus).map((status, index) => ({
      id: status,
      name: status,
      color: project.color,
      order: index,
      type: 'global',
    }));

    const customColumns = project.customStatuses.map((status) => ({
      id: status.id,
      name: status.name,
      color: status.color,
      order: status.order,
      type: 'custom',
      isDefault: status.isDefault,
    }));

    return {
      data: {
        project: {
          id: project.id,
          name: project.name,
          slug: project.slug,
          color: project.color,
        },
        columns: project.customStatuses.length ? customColumns : defaultColumns,
        tasks: project.tasks,
      },
    };
  }

  private async ensureExists(slug: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } });

    if (!project) {
      throw new NotFoundException(`Project ${slug} not found`);
    }

    return project;
  }
}
