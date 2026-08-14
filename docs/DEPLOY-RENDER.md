# Deploying to Render (step by step)

This guide deploys the **entire** website — public site, admin dashboard, and
database — to [Render](https://render.com) as a single service using the
`render.yaml` blueprint in this repo. No command line is needed on your side
beyond the one-time GitHub upload; Render builds everything in the cloud.

## What you'll end up with

- One live URL (e.g. `https://jtc-website.onrender.com`) serving the public site.
- The admin dashboard at `…/admin/login`, backed by a real PostgreSQL database.
- Prayer and contact form submissions saved to that database.

## Before you start

1. A **GitHub** account — https://github.com (free).
2. A **Render** account — https://render.com (sign up with GitHub; free).
3. Decide your **admin email** and a **strong admin password** (≥ 8 characters).
   You'll type these into Render during setup.

> **Free-tier notes.** Render's free web service "sleeps" after ~15 minutes of
> inactivity, so the first visit after idle takes ~30–50 seconds to wake. Render's
> free PostgreSQL is also time-limited (it expires after a set period and must be
> recreated or upgraded). Fine for testing and a small church site; upgrade to a
> paid instance when you want it always-on.

## Step 1 — Put the code on GitHub

Easiest without the command line — use **GitHub Desktop**:

1. Install GitHub Desktop from https://desktop.github.com and sign in.
2. **File → Add Local Repository**, choose the folder `C:\Users\Josh\Documents\JTC Website`.
   If it says it's not a repository, click **"create a repository"** here.
3. Give it a name (e.g. `jtc-website`), keep it **Private**, click **Create Repository**.
4. Click **Publish repository** (top bar) to push it to your GitHub account.

The `.gitignore` already excludes `node_modules`, `.env`, and build output, so no
secrets or bulky files get uploaded.

## Step 2 — Create the Blueprint on Render

1. Go to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub account if prompted, then pick the `jtc-website` repo.
4. Render detects `render.yaml` and shows a plan: **one database + one web
   service**. Click **Apply**.

## Step 3 — Fill in the two values Render asks for

Render will prompt for the environment variables marked "sync: false":

| Variable | What to enter |
| --- | --- |
| `SEED_ADMIN_EMAIL` | The email you'll log in to the admin with |
| `SEED_ADMIN_PASSWORD` | A strong password (≥ 8 chars) — you'll use this to sign in |

The JWT and cookie secrets are generated automatically — you don't touch them.
`SEED_ADMIN_NAME` defaults to "Church Admin" (changeable later).

## Step 4 — Wait for the first deploy

Render will now, automatically:

1. Install dependencies.
2. Build the React frontend.
3. Create the database tables (`prisma db push`).
4. Seed your admin account + sample content.
5. Start the server (which serves both the API and the website).

Watch the **Logs** tab. When you see `JTC API listening…` and the service turns
**Live**, open the service URL at the top of the page.

## Step 5 — Sign in to the admin

Go to `https://<your-service>.onrender.com/admin/login` and sign in with the
admin email + password you entered in Step 3.

## Updating the site later

Any time you push a change to the GitHub repo (via GitHub Desktop → **Commit** →
**Push**), Render automatically rebuilds and redeploys. The seed step is safe to
re-run — it never overwrites your admin password or duplicates content.

## Editing church details

All church-wide content (name, address, service times, contact info, social
links) lives in `src/config/siteConfig.ts`. Edit it, commit, and push — Render
redeploys with the new details. Replace placeholder images by dropping real files
in `public/` and updating the referenced paths.

## Troubleshooting

- **Build failed.** Open the **Logs** tab, copy the red error text, and share it —
  most build errors are a quick fix.
- **Site loads but admin login fails.** Confirm the deploy finished the *seed*
  step in the logs (look for `Seeded SUPER_ADMIN`). If not, check that
  `SEED_ADMIN_PASSWORD` is set (≥ 8 chars) under the service's **Environment**
  tab, then **Manual Deploy → Clear build cache & deploy**.
- **First load is very slow.** Expected on the free tier (the service was asleep).
  Upgrade the instance to keep it always-on.
- **Database expired / gone.** Free Postgres is temporary. Create a new database,
  update `DATABASE_URL`, and redeploy — or upgrade to a paid database.

## Alternative: split hosting

If you later prefer Vercel for the frontend, you can host the API separately, but
you'll then need to (a) point the frontend's `VITE_API_BASE_URL` at the API's URL,
(b) add the frontend origin to `CORS_ORIGINS`, and (c) relax the auth cookies to
`SameSite=None; Secure` (they're `Lax` today, which only works same-origin). The
single-service setup above avoids all three, which is why it's the default.
