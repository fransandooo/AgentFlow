FROM node:20-alpine
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/types/package.json ./packages/types/package.json
RUN pnpm install --filter @agentflow/api... --frozen-lockfile=false

COPY apps/api ./apps/api
COPY packages/types ./packages/types

RUN pnpm --filter @agentflow/api prisma:generate
RUN pnpm --filter @agentflow/api build

EXPOSE 3001
CMD ["pnpm", "--filter", "@agentflow/api", "start"]
