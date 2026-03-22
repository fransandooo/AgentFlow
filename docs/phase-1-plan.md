# AgentFlow — Fase 1

## Objetivo

Levantar el core backend del monorepo siguiendo el documento de arquitectura confirmado.

## Entregables completados

- Monorepo con pnpm workspaces
- Estructura `apps/api`, `apps/web`, `packages/types`, `infra`, `.github/workflows`
- Esqueleto real de NestJS en `apps/api`
- Prisma schema inicial para User, Agent, Team, TeamMember, Project, TaskStatus, Task, Comment y ActivityLog
- Módulos backend: `auth`, `users`, `agents`, `teams`, `projects`, `tasks`, `comments`, `activity`, `dashboard`, `websocket`, `prisma`
- DTOs iniciales y convenciones de response `{ data, meta? }`
- Tipos compartidos iniciales en `packages/types`

## Decisiones tomadas

- `createdById` en `Task` se modela como referencia polimórfica (`createdByType` + `createdById`) a nivel de aplicación
- Validaciones duales user/agent se resuelven en servicios/DTOs y más adelante con constraints SQL adicionales donde compense
- WebSocket y BullMQ quedan con esqueleto listo, pero la integración funcional completa pasa a Fase 2

## Pendiente dentro de Fase 1

- Implementar lógica real de servicios con Prisma
- Añadir guards/auth real (JWT + API key)
- Generar migraciones Prisma
- Tests básicos
- Instalar dependencias y validar build

## Siguiente fase sugerida

Cerrar Fase 1 con lógica persistente real en backend y después pasar a realtime (Fase 2).
