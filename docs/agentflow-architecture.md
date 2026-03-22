# AgentFlow — Arquitectura base

Este archivo consolida las decisiones confirmadas del proyecto.

## Dominio principal

- Usuarios humanos autenticados con JWT
- Agentes autenticados con API keys vía `X-Agent-Key`
- Equipos que agrupan usuarios y agentes
- Proyectos con board Kanban
- Tareas con subtareas, comentarios y activity log

## Reglas clave

- El humano tiene acceso total
- Los agentes solo operan sobre tareas asignadas a ellos
- Las API keys se almacenan hasheadas
- Las respuestas REST se envuelven en `{ data, meta? }`
- Los eventos realtime salen por Socket.IO namespace `/ws`

## Estado de implementación

### Fase 1 aterrizada
- Monorepo base
- Esqueleto de NestJS en `apps/api`
- Prisma schema inicial alineado con el documento funcional
- Tipos compartidos iniciales en `packages/types`

## Conflictos detectados / decisiones técnicas

1. `createdById UUID FK → User | Agent` en `Task`
   - Prisma/PostgreSQL no permiten un único FK apuntando a dos tablas distintas.
   - Solución aplicada en esta fase: `createdByType` + `createdById` como referencia polimórfica a nivel de aplicación.

2. Constraint `userId OR agentId` en `TeamMember`
   - Prisma no expresa bien ese check cross-column en schema puro.
   - Se deja modelado con columnas opcionales y unicidad por par; el check estricto se implementará en migración SQL/manual o lógica de servicio.

3. Comentarios y activity logs con autor actor dual
   - Mismo patrón: dos columnas opcionales y validación en servicio.
