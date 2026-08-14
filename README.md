# Jesus The Counselor Cavite — Church Website

A production-quality website for **Jesus The Counselor Cavite**, a Christ-centered,
full-gospel Christian church in the City of General Trias, Cavite, Philippines.

- **Frontend:** React 18 + TypeScript + Vite 5 + React Router 6, CSS Modules with
  centralized design tokens.
- **Backend:** Node + Express + TypeScript, PostgreSQL via Prisma, JWT auth with
  role-based access control.

The frontend runs standalone against built-in mock data, so you can develop and
preview the whole site without a database. See `docs/ARCHITECTURE.md` for the full
design and folder conventions.

## Prerequisites

- Node.js 18+ and npm
- (Backend only) PostgreSQL 14+

> **Note:** this project was authored in an environment without npm registry
> access, so dependencies were **not** installed and the build/lint/Prisma
> toolchain was **not** run there. Run the commands below on your own machine.

## Quick start (frontend only, mock data)

```bash
npm install
cp .env.example .env      # adjust values as needed
npm run dev               # Vite dev server
```

The site uses in-repo mock data by default (`USE_MOCK_DATA`), so every page,
list, filter, and form works without a backend. Church content comes from
`src/config/siteConfig.ts` — edit that one file to update church-wide details.

## Full stack (with backend + database)

1. Provision a PostgreSQL database and set `DATABASE_URL` in `.env`.
2. Set the JWT secrets, cookie settings, `CORS_ORIGINS`, and the seed admin
   credentials (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME`).
3. Generate the client, run migrations, and seed:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. Start the API and the frontend (Vite proxies `/api` to the server):

   ```bash
   npm run server:dev      # Express API
   npm run dev             # frontend, in a second terminal
   ```

5. Sign in to the admin dashboard at `/admin/login` with the seeded admin
   account.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Frontend dev server (Vite) |
| `npm run build` | Type-check and build the frontend for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint the codebase |
| `npm run server:dev` | Run the Express API in watch mode |
| `npm run server:build` | Compile the backend |
| `npm run server:start` | Run the compiled backend |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run prisma:migrate` | Apply database migrations (dev) |
| `npm run prisma:seed` | Seed the database (admin + sample content) |
| `npm run prisma:studio` | Open Prisma Studio |

## Configuration

Every environment variable is documented with placeholders in `.env.example`.
Frontend variables are `VITE_`-prefixed. Never commit a real `.env`.

**Church-specific content is centralized** in `src/config/siteConfig.ts` (name,
address, service times, contact details, social links, SEO defaults). Update it
there rather than editing individual components. Imagery uses branded gradient
placeholders (`placeholder:` sentinels) until real assets are added.

## Project structure

```
src/
├── config/      church single-source-of-truth + API config
├── styles/      design tokens + global CSS
├── types/       shared TypeScript types
├── data/        navigation, constants, mock fixtures
├── services/    data layer (mock ⇄ HTTP)
├── hooks/       async + data hooks
├── context/     Auth + Toast providers
├── components/  reusable UI (common/ + feature folders)
├── pages/       public route pages
└── admin/       auth-gated admin dashboard

server/          Express + Prisma REST API
prisma/          schema, migrations, seed
docs/            ARCHITECTURE.md
```

## Documentation

- `docs/ARCHITECTURE.md` — full architecture, conventions, data flow, security.
- `server/README.md` — backend env vars, scripts, API surface, auth model.

## License

Proprietary — © Jesus The Counselor Cavite. All rights reserved.
