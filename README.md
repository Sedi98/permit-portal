# Permit Portal

Permit Portal is a pnpm monorepo containing the operator application and the public permit portal.

## Applications

- `apps/operator` — React 19 + Vite operator dashboard.
- `apps/web` — Next.js 16 public permit portal using the App Router.

Both applications connect to `https://permit-back.secop.az/api` independently and are intended for separate deployments.

## Development

Install dependencies from the repository root:

```bash
pnpm install
```

Run an application:

```bash
pnpm dev:operator
pnpm dev:web
```

Run checks for both applications:

```bash
pnpm lint
pnpm build
```

The operator reads `VITE_API_BASE_URL` from `apps/operator/.env`. The web app reads `NEXT_PUBLIC_API_BASE_URL`; copy `apps/web/.env.example` to `apps/web/.env.local` for local configuration.

## Deployment

Deploy `apps/operator` and `apps/web` as separate projects. Set each app's environment variables in its own deployment configuration and use the corresponding app directory as the project root.
