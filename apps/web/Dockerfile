FROM node:20-alpine
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install --filter @agentflow/web --frozen-lockfile=false

COPY apps/web ./apps/web

EXPOSE 3000
CMD ["pnpm", "--filter", "@agentflow/web", "dev"]
