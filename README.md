# Focus X

Mobile app (Expo) with a Node.js + Prisma backend.

## Environment Setup

### 1) Frontend env (project root)

Create `.env` in the root using `.env.example`:

```bash
cp .env.example .env
```

Set:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000
```

Use your deployed backend URL in production.

Important: use the backend deployment URL (separate Vercel project from `backend/`), not the frontend/root project URL.

### 2) Backend env (`backend/`)

Create `backend/.env` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Set:

```env
DATABASE_URL=your_neon_or_postgres_connection_string
PORT=4000
```

## Run Locally

### Backend

```bash
cd backend
npm install
npm run prisma:push
npm run dev
```

### Frontend

```bash
npm install
npm start
```

The app will call APIs from `EXPO_PUBLIC_API_URL`.

## Vercel Deployment (Required Setup)

1. Deploy `backend/` as a separate Vercel project.
2. In backend Vercel project, set `DATABASE_URL`.
3. Ensure backend deployment protection is off (or public access is allowed), otherwise mobile requests hit Vercel auth HTML.
4. Set root `.env`:

```env
EXPO_PUBLIC_API_URL=https://<focusx-backend>.vercel.app
```

5. Verify backend endpoint:
   - `https://<focusx-backend>.vercel.app/health` should return backend JSON (not Vercel login page).
