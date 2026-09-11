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

## Docker

Docker Compose builds and runs both applications from the repository root. Before
building, create the following files relative to the repository root. The filenames
must be exactly `.env`; Docker Compose does not use `.env.local` for these services.

```text
permit-portal/
├── apps/
│   ├── operator/
│   │   └── .env
│   └── web/
│       └── .env
└── docker-compose.yml
```

Configure the operator application in `apps/operator/.env`:

```dotenv
VITE_API_BASE_URL=https://permit-back.secop.az
```

Configure the public web application in `apps/web/.env`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://permit-back.secop.az/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_TEST_MODE=false
```

`NEXT_PUBLIC_SITE_URL` may be omitted when the application should use its built-in
site URL fallback. Enable `NEXT_PUBLIC_AUTH_TEST_MODE` only for local myGov testing.

Start both applications in the background:

```bash
docker compose up --build -d
```

After the images are built and the containers start, the applications are available
through these host ports:

| Application | Compose service | Container port | Host address |
| --- | --- | --- | --- |
| Public web portal | `web` | `3000` | http://localhost:3000 |
| Operator dashboard | `operator` | `80` | http://localhost:5050 |

View service logs:

```bash
docker compose logs -f web
docker compose logs -f operator
```

After changing either workspace's `.env`, rebuild its image because `VITE_*` and
`NEXT_PUBLIC_*` values are embedded during the application build:

```bash
docker compose up --build -d web
docker compose up --build -d operator
```

Stop and remove the containers:

```bash
docker compose down
```

## Deployment

Deploy `apps/operator` and `apps/web` as separate projects. Set each app's environment variables in its own deployment configuration and use the corresponding app directory as the project root.
