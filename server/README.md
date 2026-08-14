# JTC Cavite — Backend API

Modular Express + TypeScript + Prisma (PostgreSQL) API for the Jesus The
Counselor Cavite website. Response shapes mirror the frontend domain types
in `src/types/*` and the endpoint map in `src/config/apiConfig.ts`, so the
frontend services work against this API with no changes (flip
`VITE_USE_MOCK_DATA=false`).

## Layout

```
server/
  server.ts            # entry: boots app, connects Prisma, graceful shutdown
  app.ts               # Express assembly: security, parsers, routes, errors
  config/              # env.ts (zod-validated), prisma.ts (singleton)
  middleware/          # auth, rbac, validate, rateLimit, errorHandler, notFound, requestLogger
  utils/               # jwt, password, cookies, pagination, slug, httpError, asyncHandler
  models/              # serializers.ts — Prisma rows -> frontend DTO shapes
  validators/          # zod schemas per resource (+ shared.ts)
  services/            # data/business logic per resource
  controllers/         # thin HTTP glue per resource
  routes/              # per-resource routers + index.ts (mounts under /api)
prisma/
  schema.prisma        # datasource + models
  seed.ts              # SUPER_ADMIN (from env) + sample content (mock parity)
```

## Environment variables

Copy `.env.example` to `.env` and fill in real values. Backend keys:

| Var | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | no | `development` \| `test` \| `production` |
| `SERVER_PORT` | no | API port (default 4000) |
| `DATABASE_URL` | **yes** | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | **yes** | Signs short-lived access tokens (>= 16 chars) |
| `JWT_REFRESH_SECRET` | **yes** | Signs refresh tokens; must differ from access |
| `JWT_ACCESS_EXPIRES_IN` | no | Access TTL (default `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | no | Refresh TTL (default `7d`) |
| `COOKIE_SECRET` | **yes** | Signs cookies (>= 16 chars) |
| `COOKIE_DOMAIN` | no | Cookie scope; blank for localhost |
| `CORS_ORIGINS` | no | Comma-separated allowed origins (falls back to `CLIENT_URL`) |
| `CLIENT_URL` | no | Frontend origin (default `http://localhost:5173`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | for seed | Initial SUPER_ADMIN |

In production the server refuses to boot with placeholder secrets or with
identical access/refresh secrets.

## Scripts (from repo root `package.json`)

```
npm run server:dev       # tsx watch server/server.ts (hot reload)
npm run server:build     # tsc -p server/tsconfig.json -> dist-server/
npm run server:start     # node dist-server/server.js (prod)
npm run prisma:generate  # generate Prisma client
npm run prisma:migrate   # create/apply dev migration
npm run prisma:seed      # tsx prisma/seed.ts (idempotent)
npm run prisma:studio    # Prisma Studio
```

## First-time setup

```bash
npm install
cp .env.example .env          # then edit secrets + DATABASE_URL
npm run prisma:generate
npm run prisma:migrate        # e.g. --name init
npm run prisma:seed
npm run server:dev
```

The Vite dev server already proxies `/api` -> `http://localhost:4000`
(`vite.config.ts`), so run `npm run dev` alongside `npm run server:dev`.

## API surface (all under `/api`)

- `GET  /health`
- `POST /auth/login` · `POST /auth/refresh` · `POST /auth/logout` · `GET /auth/me`
- `GET  /sermons` (search, speaker, series, tag, page, pageSize) · `GET /sermons/featured` · `GET /sermons/:slug` · `POST/PUT/DELETE` (EDITOR+)
- `GET  /series` · `GET /speakers`
- `GET  /events` (category, search, upcomingOnly, page, pageSize) · `GET /events/featured?limit` · `GET /events/:slug` · CRUD (EDITOR+)
- `GET  /ministries` (category) · `GET /ministries/:slug` · CRUD (EDITOR+)
- `GET  /locations` · `GET /locations/main` · `GET /locations/:slug` · CRUD (EDITOR+)
- `GET  /staff` · CRUD by id (EDITOR+)
- `GET  /announcements` (active; `?all=true` for editors) · CRUD by id (EDITOR+)
- `POST /prayer` (public, honeypot + strict limit) · `GET /prayer` · `PATCH /prayer/:id/handled` (STAFF+)
- `POST /contact` (public, honeypot + strict limit) · `GET /contact` · `PATCH /contact/:id/handled` (STAFF+)
- `GET  /search?q=`
- `GET/POST/PUT/DELETE /users` (ADMIN, SUPER_ADMIN)

## Auth model

Cookie-based to match the frontend (`credentials: 'include'`, no client-side
token storage). Login sets two httpOnly cookies — a short-lived access token
and a rotating refresh token — and returns the `AuthUser` JSON body. The
refresh endpoint verifies + rotates against the `RefreshToken` table
(hashed, revocable). Access tokens are also accepted via
`Authorization: Bearer` for API tooling.

## Security posture (Phase 17)

- `helmet` security headers; `x-powered-by` disabled.
- CORS locked to `CORS_ORIGINS`/`CLIENT_URL` with credentials.
- JSON/urlencoded body size capped at 10kb.
- Layered rate limiting: global on `/api`, strict on auth + public form submits.
- All request bodies/queries/params validated with zod before controllers.
- Refresh + access tokens in httpOnly, sameSite=lax, secure (prod) cookies.
- Passwords hashed with bcrypt (cost 12). Secrets read from env, never hardcoded.
- Generic client error messages; no stack traces leaked in production.
- Prayer/contact honeypot (`website`) silently accepts + drops bot submissions.
- Prisma parameterizes all queries (no string-built SQL) — search input is safe.
```
