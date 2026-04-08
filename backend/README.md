# Focus X Backend

Vercel-ready Node.js backend using Express + Prisma + Neon PostgreSQL.

## Setup

1. Install dependencies:
   - `npm install`
2. Set database URL:
   - Create `.env` from `.env.example`
   - Put your Neon connection string in `DATABASE_URL`
3. Push schema:
   - `npm run prisma:push`
4. Run local server:
   - `npm run dev`

Server default: `http://localhost:4000`

## API Endpoints

- `GET /health`
- `POST /auth/signup`
- `POST /auth/login`
- `POST /sessions/start`
- `POST /sessions/:id/complete`
- `POST /sessions/:id/abandon`
- `GET /analytics/:userId`

## Vercel Deployment

Deploy the `backend` folder as a separate Vercel project.

Set this environment variable in Vercel:
- `DATABASE_URL` = your Neon URL

Prisma client is auto-generated on install via `postinstall`.
