# Nitro Starter

![CI](https://github.com/xcvzmoon/nitro-starter/actions/workflows/ci.yaml/badge.svg)

Create your API and deploy it anywhere with this Nitro starter.

## Features

- **API routing** — file-based routes under `server/routes/`, auto-prefixed with `/api`
- **Auth** — email/password authentication via [better-auth](https://better-auth.com) with Drizzle adapter
- **Database** — PostgreSQL via Drizzle ORM, with query logging
- **S3 storage** — Nitro storage driver for object storage
- **Redis** — Nitro storage driver for caching
- **WebSocket** — real-time two-way communication via `server/routes/ws.ts`
- **SSE** — server-sent events via `server/routes/sse.ts`
- **Email** — transactional email via [unemail](https://unemail.dev) with SMTP driver, retry, circuit breaker, and logging middleware
- **Linting & formatting** — [oxc](https://oxc.rs/) toolchain: `oxfmt` for formatting, `oxlint` + `oxlint-tsgolint` for linting
- **Docker** — containerized builds with automatic version tagging from `package.json`
- **Changelog generation** — `changelogen` for automated releases
- **Pre-commit hooks** — `husky` + `lint-staged` for auto-formatting and linting on commit

## Getting started

Clone the repo, copy the environment file, install, and start developing:

```bash
pnpx giget gh:xcvzmoon/nitro-starter my-api-app --install
```

Edit `.env` with your database, Redis, S3, and SMTP credentials as needed.

## Scripts

| Command                   | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `pnpm dev`                | Start development server                                      |
| `pnpm build`              | Build for production                                          |
| `pnpm preview`            | Preview production build                                      |
| `pnpm fmt`                | Format all files with oxfmt                                   |
| `pnpm lint`               | Lint all files with oxlint                                    |
| `pnpm release:patch`      | Bump patch version, release, and build Docker image           |
| `pnpm release:minor`      | Bump minor version, release, and build Docker image           |
| `pnpm release:major`      | Bump major version, release, and build Docker image           |
| `pnpm release:dry`        | Dry-run changelog generation                                  |
| `pnpm db:generate`        | Generate database migration                                   |
| `pnpm db:push`            | Push schema to database                                       |
| `pnpm db:pull`            | Pull database schema                                          |
| `pnpm db:studio`          | Open Drizzle Studio                                           |
| `pnpm db:check`           | Check for pending migrations                                  |
| `pnpm docker`             | Run any `docker compose` command passthrough                  |
| `pnpm docker:build`       | Build Docker image tagged with current `package.json` version |
| `pnpm docker:config`      | Validate and view compose file                                |
| `pnpm docker:up`          | Build and start container                                     |
| `pnpm docker:up:detached` | Build and start container in background                       |
| `pnpm docker:down`        | Stop and remove container                                     |
| `pnpm docker:logs`        | Tail container logs                                           |
| `pnpm docker:ps`          | List running containers                                       |
| `pnpm docker:restart`     | Restart container                                             |

## Changelog

Releases are managed with `changelogen`. It reads [Conventional Commits](https://www.conventionalcommits.org/) to determine the next version and generates `CHANGELOG.md` automatically.

To preview what the next release will look like:

```bash
pnpm release:dry
```

When ready, run one of:

```bash
pnpm release:patch   # 0.0.1 → 0.0.2
pnpm release:minor   # 0.0.1 → 0.1.0
pnpm release:major   # 0.0.1 → 1.0.0
```

Each command bumps the version, generates the changelog, creates a git tag, pushes both the commit and tag, then builds a Docker image tagged with the new version.

## Database

This starter uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL. The schema lives in `server/database/schema.ts` and migrations go to `server/database/migrations/`.

Make sure `.env` has valid `DB_*` variables before running any db command.

```bash
pnpm db:generate   # Create a new migration from schema changes
pnpm db:push       # Push schema directly to the database (dev only)
pnpm db:pull       # Introspect the database and generate schema
pnpm db:studio     # Open Drizzle Studio GUI to browse data
pnpm db:check      # Check if there are pending migrations
```

The workflow is: edit `schema.ts` → `pnpm db:generate` → review the migration → `pnpm db:push`.

Configuration is in `drizzle.config.ts`. Key options:

| Option         | Description                      |
| -------------- | -------------------------------- |
| `dialect`      | Database dialect (`postgresql`)  |
| `schema`       | Path to your schema file         |
| `out`          | Output directory for migrations  |
| `casing`       | Naming convention (`snake_case`) |
| `schemaFilter` | Schemas to include (empty = all) |
| `tablesFilter` | Tables to include (empty = all)  |

Credentials are validated with Zod at config-load time from the `DB_*` environment variables. If a variable is missing or invalid, Drizzle will fail with a clear error message.

## Email

Transactional email powered by [unemail](https://unemail.dev) with an SMTP driver. Configuration is done via environment variables:

| Variable        | Description                  |
| --------------- | ---------------------------- |
| `SMTP_HOST`     | SMTP server hostname         |
| `SMTP_PORT`     | SMTP server port             |
| `SMTP_SECURE`   | Use SSL/TLS (`true`/`false`) |
| `SMTP_USER`     | SMTP authentication user     |
| `SMTP_PASSWORD` | SMTP authentication password |
| `GMAIL_EMAIL`   | Default sender email address |

Credentials are validated with Zod at startup. The driver is wrapped with retry (full-jitter backoff, 3 retries), circuit breaker (5 failures, 30s cooldown), and logging middleware (redacted local parts).

### Usage

```ts
import { sendEmail } from '~/server/lib/unemail/utils';

const { data, error } = await sendEmail({
  to: 'user@example.com',
  subject: 'Hello',
  text: 'Plain text body',
  html: '<p>HTML body</p>',
});
```

### Example endpoint

`POST /api/email` — accepts `multipart/form-data` with fields `to`, `subject`, `text`, `html`:

```bash
curl -X POST http://localhost:3000/api/email \
  -F to=user@example.com \
  -F subject=Hello \
  -F text="Hello world"
```

Returns the email result on success. On failure, returns `502 Bad Gateway` (retryable errors) or `400 Bad Request` (non-retryable).

## Auth

Authentication is powered by [better-auth](https://better-auth.com) with a PostgreSQL adapter via Drizzle ORM. Email/password authentication is enabled by default.

### How it works

The `server/routes/api/auth/[...all].ts` catch-all route proxies all requests under `/api/auth/*` to the better-auth handler. This means better-auth manages its own routing — you don't need to define individual auth endpoints.

The auth schema (`user`, `session`, `account`, `verification` tables) is defined in `server/database/schemas/public.ts` using the shared `id()` and `timestamps()` helpers. Relations are set up in `server/database/relations.ts` via `defineRelations`.

Configuration lives in `server/lib/better-auth/auth.ts`:

```ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: { enabled: true },
});
```

### Available endpoints

Better-auth exposes the following endpoints automatically via the catch-all handler:

| Method | Path                        | Description                 |
| ------ | --------------------------- | --------------------------- |
| POST   | `/api/auth/sign-in/email`   | Sign in with email/password |
| POST   | `/api/auth/sign-up/email`   | Create a new account        |
| POST   | `/api/auth/sign-out`        | Sign out current session    |
| GET    | `/api/auth/session`         | Get current session         |
| GET    | `/api/auth/ok`              | Health check                |
| POST   | `/api/auth/forgot-password` | Request password reset      |
| POST   | `/api/auth/reset-password`  | Reset password with token   |
| PUT    | `/api/auth/account`         | Update account info         |

### Sign-up body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Sign-in body

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

## Environment variables

| Variable                                                                            | Description             |
| ----------------------------------------------------------------------------------- | ----------------------- |
| `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_SSL`             | PostgreSQL connection   |
| `REDIS_URL`                                                                         | Redis connection string |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION` | S3-compatible storage   |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`               | SMTP credentials        |
| `GMAIL_EMAIL`                                                                       | Default sender email    |

## Docker

The project includes a `Dockerfile` and `compose.yaml` for containerized builds. The production image is based on `node:26-slim` — minimal and lightweight. The Docker image tag is derived from the `version` field in `package.json` — every image is tagged as `nitro-starter:<version>`.

### How it works

The `scripts/docker.ts` helper wraps `docker compose` and injects the current `package.json` version as the `IMAGE_TAG` environment variable. The `compose.yaml` uses that variable to set the image name:

```yaml
image: nitro-starter:${IMAGE_TAG:-latest}
```

This means:

- Running `pnpm release:patch` (or `:minor`/`:major`) bumps the version in `package.json`, then builds a Docker image tagged with the new version
- Running `pnpm docker:build` builds an image tagged with the current version (e.g., `nitro-starter:0.0.1`)
- Running `docker compose` directly without the script falls back to `nitro-starter:latest`

Environment variables are loaded from `.env` via `env_file` at runtime — secrets are never baked into the image.

### Standalone usage

```bash
pnpm docker:build              # Build: nitro-starter:<current-version>
pnpm docker:up                 # Build & start
pnpm docker:up:detached        # Build & start in background
pnpm docker:down               # Stop & remove
pnpm docker:logs               # Tail logs
pnpm docker:ps                 # List containers
pnpm docker:restart            # Restart
```

## Project structure

```
├── .github/workflows/  # CI pipeline
├── .husky/             # git hooks
├── public/             # static assets
├── server/
│   ├── database/       # Drizzle schema & client
│   ├── lib/
│   │   └── unemail/    # Email driver & utilities
│   └── routes/         # route handlers
│       └── api/        # /api-prefixed handlers
├── .env.example
├── .nvmrc
├── AGENTS.md
├── drizzle.config.ts
├── index.html
├── nitro.config.ts
├── oxfmt.config.ts
├── oxlint.config.ts
├── package.json
└── tsconfig.json
```

## Deploying

### Standalone

```bash
pnpm build
```

Then checkout the [Nitro deployment docs](https://nitro.build/deploy) to learn more about the different deployment presets.

### Docker

```bash
pnpm docker:build
pnpm docker:up:detached
```

Or use a release script to bump the version and build in one step:

```bash
pnpm release:patch   # bumps version, pushes tag, builds docker image
```
