import cors from 'cors';
import express from 'express';
import { prisma } from './prisma.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ ok: true, db: 'connected' });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'database_unreachable' });
  }
});

app.post('/auth/signup', async (req, res) => {
  const { fullName, email, password } = req.body || {};
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'fullName, email and password are required' });
  }

  try {
    const user = await prisma.user.create({
      data: {
        fullName,
        email: String(email).toLowerCase(),
        passwordHash: password,
      },
      select: { id: true, fullName: true, email: true, createdAt: true },
    });
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'email already exists' });
    }
    return res.status(500).json({ error: 'signup_failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email).toLowerCase() },
    select: { id: true, fullName: true, email: true, passwordHash: true },
  });

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  return res.json({ id: user.id, fullName: user.fullName, email: user.email });
});

app.post('/sessions/start', async (req, res) => {
  const { userId, objective, mode = 'FOCUS', plannedSeconds = 1500 } = req.body || {};
  if (!userId || !objective) {
    return res.status(400).json({ error: 'userId and objective are required' });
  }

  const session = await prisma.focusSession.create({
    data: {
      userId,
      objective,
      mode,
      plannedSeconds: Number(plannedSeconds),
    },
  });

  return res.status(201).json(session);
});

app.post('/sessions/:id/complete', async (req, res) => {
  const { id } = req.params;

  const session = await prisma.focusSession.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      endedAt: new Date(),
    },
  });

  return res.json(session);
});

app.post('/sessions/:id/abandon', async (req, res) => {
  const { id } = req.params;

  const session = await prisma.focusSession.update({
    where: { id },
    data: {
      status: 'ABANDONED',
      endedAt: new Date(),
    },
  });

  return res.json(session);
});

app.get('/analytics/:userId', async (req, res) => {
  const { userId } = req.params;

  const completed = await prisma.focusSession.findMany({
    where: { userId, status: 'COMPLETED' },
    orderBy: { startedAt: 'desc' },
  });

  const totalSessions = completed.length;
  const totalFocusMinutes = completed.reduce((sum, s) => sum + Math.round(s.plannedSeconds / 60), 0);
  const avgSessionMinutes = totalSessions ? Math.round(totalFocusMinutes / totalSessions) : 0;

  return res.json({
    totalSessions,
    totalFocusMinutes,
    avgSessionMinutes,
  });
});

export default app;
