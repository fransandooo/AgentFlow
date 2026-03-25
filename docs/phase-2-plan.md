# AgentFlow — Fase 2

## Objetivo

Añadir tiempo real y escritura asíncrona de activity logs sobre el backend existente.

## Implementado

- Redis conectado desde NestJS
- BullMQ con colas:
  - `activity-log`
  - `notifications`
- Worker `activity-log` que persiste `ActivityLog` de forma asíncrona
- Socket.IO gateway en namespace `/ws`
- Rooms:
  - `project:{projectId}`
  - `global`
- Eventos soportados:
  - `task:updated`
  - `task:status_changed`
  - `task:created`
  - `task:assigned`
  - `task:comment_added`
  - `agent:activity`
- Integración en `TasksService`
- Integración en `CommentsService`

## Pendiente razonable dentro de Fase 2

- Consumidor real para `notifications`
- Emisión explícita de `agent:activity` desde flows autenticados por agente
- Tests de integración Redis/WebSocket
- Conectar frontend websocket client
