# AgentFlow — Fase 5 (Infra y CI/CD)

## Preparado

- `infra/docker-compose.prod.yml`
- `infra/.env.prod.example`
- `infra/nginx/agentflow.conf`
- workflow CI para PRs a `develop`
- workflow deploy para pushes a `main`
- despliegue de imágenes a GHCR
- despliegue remoto por SSH a la VPS

## Secrets de GitHub que faltan configurar

### Acceso VPS
- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`

### GHCR
- `GHCR_TOKEN`

### Producción
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRES_IN`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

## DNS/Hostinger pendiente

Crear un registro A:
- `agentflow.fransando.cloud` -> IP de la VPS

## SSL

La config Nginx está preparada para Let's Encrypt/Certbot.
Faltará emitir el certificado en la VPS una vez apunte el DNS.

Ejemplo manual inicial:

```bash
cd /home/franadmin/projects/agentflow/infra
mkdir -p certbot/www certbot/conf
sudo docker compose -f docker-compose.prod.yml run --rm --profile certbot certbot \
  certonly --webroot -w /var/www/certbot -d agentflow.fransando.cloud
```
