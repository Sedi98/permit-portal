FROM node:24-alpine AS build

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/operator/package.json apps/operator/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

COPY apps/operator apps/operator

ARG VITE_API_BASE_URL=https://permit-back.secop.az
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN pnpm --filter @permit-portal/operator build

FROM nginx:1.27-alpine AS runtime

COPY apps/operator/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/operator/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1
