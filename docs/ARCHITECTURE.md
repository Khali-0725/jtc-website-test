# Architecture — Jesus The Counselor Cavite

This document describes how the codebase is organized, the conventions every
module follows, and the reasoning behind the major decisions. It is the
orientation guide for anyone joining the project.

## 1. Overview

The project is a single repository containing two applications:

- **Frontend** — React 18 + TypeScript, built with Vite 5, routed with React
  Router 6. Styling is done with CSS Modules driven by a centralized set of CSS
  custom-property design tokens. No Tailwind, no CSS-in-JS runtime.
- **Backend** — Node + Express + TypeScript REST API, persisting to PostgreSQL
  through Prisma. Authentication is JWT-based (short-lived access token +
  rotating httpOnly refresh cookie) with role-based access control.

The frontend can run **completely standalone** against in-repo mock data
(`USE_MOCK_DATA`), so the UI is developable and demonstrable without a database.
When the backend is available, the same service layer transparently switches to
real HTTP calls — no component changes required.

## 2. Guiding principles

1. **Modular, never monolithic.** Every concern lives in its own file/folder.
   Files that grow past ~250–300 lines are split.
2. **Single source of truth for church content.** All church-specific
   information (name, address, service times, contact details, social links)
   lives in `src/config/siteConfig.ts`. Components never hardcode church facts.
3. **No fake functionality.** UI only claims what the code actually does. Forms
   call real services; placeholder content is clearly marked and easy to replace.
4. **No secrets in code.** All secrets come from environment variables, validated
   at boot. `.env.example` documents every key with placeholder values.
5. **Accessibility and performance are defaults**, not afterthoughts: semantic
   markup, focus management, reduced-motion support, route-level code splitting.

## 3. Repository layout

```
JTC Website/
├── index.html              # Vite entry HTML
├── vite.config.ts          # Dev server + build + path aliases + /api proxy
├── tsconfig*.json          # TS config (app + node)
├── .env.example            # All env vars (frontend + backend), placeholders
├── public/                 # Static assets served as-is
├── docs/                   # This document and other project docs
├── prisma/                 # schema.prisma, seed.ts, migrations/
├── server/                 # Express + Prisma backend (see §6)
├── tests/                  # Reserved for test suites
└── src/                    # Frontend application (see §4)
```

## 4. Frontend structure (`src/`)

```
src/
├── main.tsx          # Bootstraps: StrictMode > HelmetProvider > BrowserRouter > App
├── App.tsx           # Route tree: public layout routes + auth-gated /admin tree
├── assets/           # Imported assets
├── styles/           # Global CSS layers, imported once in main.tsx
│   ├── variables.css   # DESIGN TOKENS — colors, type scale, spacing, motion
│   ├── typography.css  # Base type rules
│   ├── animations.css  # Keyframes + reveal utilities
│   ├── responsive.css  # Breakpoint helpers
│   └── globals.css     # Resets, base element styling, skip-link
├── types/            # Shared TypeScript types (content.ts, auth.ts, index.ts)
├── config/           # siteConfig.ts (church SSOT), apiConfig.ts, index.ts
├── data/             # navigation.ts, constants.ts, mock/ (dev data), index.ts
├── utils/            # Pure helpers: dates, validation, helpers/classNames
├── services/         # Data access layer — mock/HTTP swap per USE_MOCK_DATA
├── hooks/            # useAsync, useDebounce, useSermons/useEvents/etc.
├── context/          # AuthContext, ToastContext (React providers)
├── components/       # Reusable UI (see §5)
├── pages/            # Route-level pages, one PascalCase folder each
└── admin/            # Self-contained admin dashboard (layout/pages/components)
```

### Layering rules

Data flows one direction: **pages → hooks → services → (mock data | HTTP API)**.
Components receive data via props and render it; they do not fetch. Hooks own
async state (idle/loading/empty/error/success) and expose it through the
`AsyncBoundary` contract. Services are the only layer that knows whether data
comes from mock fixtures or the network.

### Path aliases

Configured in both `tsconfig.json` and `vite.config.ts`:

`@/`, `@components/`, `@pages/`, `@services/`, `@hooks/`, `@data/`, `@utils/`,
`@config/`, `@types/`.

Always import via alias, never long relative chains (`../../../`).

## 5. Component conventions

Every component is a folder with three files:

```
Button/
├── Button.tsx          # Component + its typed props
├── Button.module.css   # Scoped styles using design tokens only
└── index.ts            # Barrel: export { Button } from './Button';
```

Pages use the same pattern with a **default export**:

```
Sermons/
├── Sermons.tsx         # export default function SermonsPage() { … }
├── Sermons.module.css
└── index.ts            # export { default } from './Sermons';
```

**`src/components/common/`** holds the design-system primitives shared
everywhere: `Button`, `Container`, `SectionHeader`, `Figure`, `Loading`,
`EmptyState`, `ErrorState`, `AsyncBoundary`, `AnimatedReveal`, `SEO`,
`Pagination`, `Card`, `Badge`, `Modal`, `VideoPlayer`, `Search`, `PageHero`.

Feature components live under domain folders (`home/`, `sermons/`, `events/`,
`ministries/`, `layout/`).

### Key cross-cutting patterns

- **`AsyncBoundary`** — renders the right UI for each state of an async hook
  (loading label, empty slot, error with retry, and the success render-prop).
  This keeps every list/detail page consistent.
- **`Figure` + `placeholder:` sentinels** — the site ships without real photos.
  Any `src` beginning with `placeholder:` renders a branded gradient poster, so
  imagery is present, on-brand, and trivially replaceable later.
- **`SEO`** — wraps react-helmet-async, pulls defaults from `siteConfig.seo`,
  and accepts per-page `title/description/path/image/jsonLd/noindex`.
- **`AnimatedReveal`** — IntersectionObserver-driven scroll reveal, disabled
  under `prefers-reduced-motion`.
- **`PageTransition`** — enter-only fade keyed on pathname plus scroll-to-top on
  navigation (skipped when the URL carries a hash so in-page anchors work).

## 6. Backend structure (`server/`)

```
server/
├── server.ts         # Boot: validate env, connect Prisma, listen, graceful shutdown
├── app.ts            # Express app: helmet, CORS, cookies, body limit, limiter,
│                     #   request logging, mount /api, 404 + error handler (last)
├── config/           # env.ts (zod-validated), prisma.ts (singleton client)
├── middleware/       # auth, rbac, validate (zod), rateLimit, errorHandler, notFound
├── utils/            # jwt, cookies, password (bcrypt), pagination, slug, httpError
├── models/           # serializers: Prisma rows → flat frontend DTOs
├── validators/       # zod request schemas per resource
├── services/         # business/data logic per resource
├── controllers/      # request handlers per resource
├── routes/           # per-resource routers + index.ts mounting under /api
└── types/            # express.d.ts (req.user augmentation)
```

Each resource (auth, sermons, events, ministries, locations, staff,
announcements, prayer, contact, search, users) is split across
validators/services/controllers/routes so no single file owns a whole feature.

### API contract

The backend returns the exact shapes the frontend `types/content.ts` expects.
List endpoints return `{ items, total, page, pageSize }`. Serializers convert
Prisma `DateTime` to `YYYY-MM-DD` strings and `null` to `undefined` so DTOs match
the TypeScript types the client already uses against mock data.

## 7. Authentication & authorization

- **Login** verifies a bcrypt hash (cost 12) and issues a short-lived JWT access
  token plus a rotating refresh token stored in an httpOnly, `SameSite`, secure
  cookie. Refresh tokens are persisted so they can be revoked/rotated.
- **`auth` middleware** reads the access token from the cookie or an
  `Authorization: Bearer` header and attaches `req.user`.
- **`rbac` middleware** enforces a role hierarchy:
  `SUPER_ADMIN > ADMIN > EDITOR > STAFF`.
  - Public reads: sermons, events, ministries, locations, staff, active
    announcements, search.
  - `EDITOR+`: content CRUD.
  - `STAFF+`: read prayer requests and contact messages.
  - `ADMIN`/`SUPER_ADMIN`: manage admin users and roles.
- The frontend mirrors this with `AuthContext` (`user`, `isAuthenticated`,
  `hasRole`) and a `RequireAuth` route guard; the `/admin` tree renders its own
  chrome and never shows the public Navbar/Footer.

## 8. Security posture (Phase 17)

- `helmet` for secure headers; CORS locked to `CORS_ORIGINS` with credentials.
- JSON body size cap; global rate limiter plus stricter limits on auth and public
  form submissions.
- **zod validation** on all request bodies, queries, and params.
- Honeypot field `website` on the public prayer and contact forms — a filled
  value is silently accepted (`200`) and dropped, defeating naive bots.
- Passwords bcrypt-hashed; secrets validated at boot (`env.ts` rejects missing or
  placeholder secrets in production and refuses equal access/refresh secrets).
- Generic client-facing error messages; no stack traces leak in production.

## 9. Data flow example (a sermon list page)

1. `SermonsPage` calls `useSermons(query)`.
2. The hook calls `sermonService.list(query)` and tracks async state.
3. `sermonService` either returns mock data (`USE_MOCK_DATA`) or issues
   `GET /api/sermons?…` and returns `{ items, total, page, pageSize }`.
4. The page renders `<AsyncBoundary state={…}>` with loading/empty/error/success
   branches; on success it maps `items` to `<SermonCard>`s inside a responsive
   grid, with `<Pagination>` driving the `page` query param.

## 10. Testing & verification

Because the development sandbox has **no npm registry access**, dependency
install and the TypeScript/Vite/Prisma toolchain cannot run there. Verification
in that environment is structural: a script walks every module and confirms all
relative and aliased imports resolve to real files/barrels.

On a developer machine, the standard checks apply: `npm run build` (type-check +
Vite build), `npm run lint`, and the backend `npm run server:build`. The `tests/`
directory is reserved for unit/integration suites.

## 11. Environment variables

All keys are documented in `.env.example`. Frontend keys are `VITE_`-prefixed
(e.g. `VITE_API_BASE_URL`, `VITE_SITE_URL`). Backend keys cover the database
(`DATABASE_URL`), JWT secrets and TTLs, cookie settings, CORS origins, server
port, media provider, and the seed admin credentials. Never commit a real
`.env`; it is git-ignored.

