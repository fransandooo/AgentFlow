# AgentFlow

Sistema de gestión de tareas estilo Jira orientado a agentes IA y usuario humano.

## Estado

Fase 1 en progreso: base del monorepo y esqueleto de arquitectura.

## Estructura

```text
agentflow/
├── apps/
│   ├── api/        # NestJS backend
│   └── web/        # Next.js frontend
├── packages/
│   └── types/      # Tipos compartidos
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── nginx/
└── .github/
    └── workflows/
```

## Stack previsto

- Backend: NestJS + Prisma + PostgreSQL + Redis + BullMQ + Socket.IO
- Frontend: Next.js 14 + Tailwind + shadcn/ui + Zustand
- Infra: Docker Compose + Nginx + GitHub Actions

## Próximos pasos

1. Scaffold real de apps/api y apps/web
2. Paquete compartido `packages/types`
3. Infra mínima local con Postgres y Redis
4. Primer modelo de datos y docs de dominios
