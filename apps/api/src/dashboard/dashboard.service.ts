import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [projects, tasksByStatus, agents, recentActivity] = await Promise.all([
      this.prisma.project.findMany({
        include: {
          tasks: true,
          _count: { select: { tasks: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.task.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.agent.findMany({
        include: {
          team: true,
          activityLogs: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activityLog.findMany({
        take: 25,
        orderBy: { createdAt: 'desc' },
        include: {
          task: { include: { project: true } },
          actorUser: true,
          actorAgent: true,
        },
      }),
    ]);

    const activeThreshold = new Date(Date.now() - 5 * 60 * 1000);

    return {
      data: {
        metrics: {
          projects: projects.length,
          tasks: tasksByStatus.reduce((acc, item) => acc + item._count._all, 0),
          tasksByStatus,
        },
        projects: projects.map((project) => ({
          id: project.id,
          name: project.name,
          slug: project.slug,
          color: project.color,
          description: project.description,
          taskCount: project._count.tasks,
          inProgress: project.tasks.filter((task) => task.status === 'IN_PROGRESS').length,
          blocked: project.tasks.filter((task) => task.status === 'BLOCKED').length,
        })),
        agents: agents.map((agent) => {
          const lastActivity = agent.activityLogs[0]?.createdAt || null;
          return {
            id: agent.id,
            name: agent.name,
            type: agent.type,
            team: agent.team,
            isActive: Boolean(lastActivity && lastActivity >= activeThreshold),
            lastActivity,
          };
        }),
        feed: recentActivity,
      },
    };
  }
}
