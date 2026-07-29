# Permit Portal Monorepo Migration

## Goal

Convert the current root-level React/Vite application into a pnpm workspace containing:

- `apps/operator`: the existing Vite application used by operators.
- `apps/web`: a new Next.js 16 application using the App Router.

The operator application remains functionally unchanged during the initial migration. The web application starts as the generated Next.js shell and connects to the existing backend independently.

## Proposed folder structure

```text
permit-portal/
├── apps/
│   ├── operator/                 # existing React 19 + Vite operator app
│   │   ├── public/
│   │   ├── src/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig*.json
│   │   └── package.json
│   └── web/                      # new Next.js 16 web app
│       ├── app/                  # App Router routes and layouts
│       ├── public/
│       ├── eslint.config.mjs
│       ├── next.config.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/                     # reserved for code shared by both apps
│   ├── api/                      # future shared API client and contracts
│   ├── ui/                       # future shared UI components/tokens
│   └── config/                   # future shared TypeScript/ESLint config
├── package.json                  # pnpm workspace scripts and metadata
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── admin-api-senedlesme.md
├── AGENTS.md
└── phases.md
```

`packages/` will only be populated when there is genuinely shared code. The first conversion will not force browser-specific Vite code into the Next.js app.

## Phases

### Phase 1 — Confirm integration boundaries

- Confirm the public web app's first responsibility and route/domain expectations.
- Confirm whether authentication, API calls, types, and UI components should be shared immediately or migrated incrementally.
- Confirm whether both apps will be deployed as separate Vercel projects or served behind one domain.

### Phase 2 — Create the pnpm workspace

- Add `pnpm-workspace.yaml` with `apps/*` and `packages/*` workspace globs.
- Replace the root application package manifest with a private workspace root manifest.
- Add root scripts for running, building, linting, and previewing each app by workspace filter.
- Preserve the existing dependency lockfile through a workspace-aware install.

### Phase 3 — Relocate the operator app

- Move the existing Vite source, public assets, Vite config, TypeScript configs, HTML entrypoint, and operator package metadata into `apps/operator`.
- Update the Vite alias and TypeScript path mappings so `@/*` still resolves to the operator app's `src/*`.
- Keep the existing React Compiler, Tailwind v4, router, API, and feature modules intact.
- Ensure root commands continue to provide a convenient operator workflow.

### Phase 4 — Generate the Next.js app

- Run the requested generator with pnpm using the `--yes` option, targeting `apps/web`.
- Use TypeScript, Tailwind CSS, ESLint, App Router, Turbopack, and the `@/*` alias from the generator defaults.
- Pin/verify the generated Next.js dependency at the Next.js 16 line.
- Keep Next.js-specific configuration and dependencies scoped to `apps/web`.

### Phase 5 — Establish independent app integrations

- Keep authentication, API clients, and types owned by each app.
- Configure `VITE_API_BASE_URL` for the operator and `NEXT_PUBLIC_API_BASE_URL` for the web app.
- Add a minimal public web route/layout and a backend connectivity boundary without sharing application code.
- Document local development URLs and API configuration.

### Phase 6 — Verify the workspace

- Run the operator lint and build.
- Run the web lint and production build.
- Run root workspace commands using pnpm filters.
- Check that generated build output remains ignored and that no root-level app files are accidentally left behind.
- Update the README with workspace commands and deployment notes.

### Phase 7 — Incremental feature migration (later)

- Define the web app's user-facing routes and UX.
- Extract only cross-app contracts, API clients, and design primitives that both apps actually use.
- Add authentication/session integration with an explicit provider decision.
- Migrate features one slice at a time while keeping operator workflows stable.

## Confirmed decisions

1. The web app is a public permit portal.
2. The web app connects to `https://permit-back.secop.az/api` immediately.
3. Each app owns its authentication, API client, and types.
4. The apps deploy as separate projects.
