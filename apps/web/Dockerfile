FROM node:24-alpine AS build

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/operator/package.json apps/operator/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

COPY apps/web apps/web

ARG NEXT_PUBLIC_API_BASE_URL=https://permit-back.secop.az/api
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_AUTH_TEST_MODE=true
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_AUTH_TEST_MODE=${NEXT_PUBLIC_AUTH_TEST_MODE}

RUN pnpm --filter @permit-portal/web build
RUN pnpm --filter @permit-portal/web deploy --prod --legacy /prod/web
RUN cp -a apps/web/.next /prod/web/.next
RUN cp -a apps/web/public /prod/web/public

FROM node:24-alpine AS runtime

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.0.0 --activate

COPY --from=build --chown=node:node /prod/web ./

USER node

EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start"]
