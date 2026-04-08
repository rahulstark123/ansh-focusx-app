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
