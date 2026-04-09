import cors from 'cors';
import express from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { Prisma } from '@prisma/client';
import { prisma } from './prisma.js';

const app = express();

function normalizeSupabaseUrl(url) {
  if (!url) return null;
  let u = String(url).trim().replace(/\/+$/, '');
  if (u.startsWith('http://')) {
    u = `https://${u.slice('http://'.length)}`;
  }
  return u;
}
const RANK_LEVELS = [
  'INITIATE',
  'DISCIPLINED',
  'FOCUSED',
  'ADVANCED',
  'ELITE',
  'TITAN',
  'LEGEND',
];
const SUPABASE_URL = normalizeSupabaseUrl(process.env.SUPABASE_URL);
const supabaseIssuer = SUPABASE_URL ? `${SUPABASE_URL}/auth/v1` : null;
const supabaseJwks = supabaseIssuer
  ? createRemoteJWKSet(new URL(`${supabaseIssuer}/.well-known/jwks.json`))
  : null;
const RANKINGS_CACHE_TTL_MS = 30_000;
let rankingsCache = {
  expiresAt: 0,
  ranked: [],
  refreshPromise: null,
};

async function verifySupabaseTokenFromRequest(req) {
  if (!supabaseIssuer || !supabaseJwks) {
    throw new Error('supabase_auth_not_configured');
  }
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('missing_bearer_token');
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    throw new Error('missing_bearer_token');
  }

  try {
    const { payload } = await jwtVerify(token, supabaseJwks, {
      issuer: supabaseIssuer,
      audience: 'authenticated',
      clockTolerance: 60,
    });
    return payload;
  } catch (err) {
    throw Object.assign(new Error('jwt_verification_failed'), { cause: err });
  }
}

function isJwtVerificationFailed(error) {
  return error?.message === 'jwt_verification_failed';
}

function getRankLevel(totalFocusHours) {
  if (totalFocusHours >= 250) return 'LEGEND';
  if (totalFocusHours >= 150) return 'TITAN';
  if (totalFocusHours >= 90) return 'ELITE';
  if (totalFocusHours >= 50) return 'ADVANCED';
  if (totalFocusHours >= 20) return 'FOCUSED';
  if (totalFocusHours >= 5) return 'DISCIPLINED';
  return 'INITIATE';
}

async function buildAndPersistRankings() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      sessions: {
        where: { status: 'COMPLETED', quitted: false },
        select: { plannedSeconds: true },
      },
    },
  });

  const ranked = users
    .map((user) => {
      const totalFocusSeconds = user.sessions.reduce((sum, s) => sum + Number(s.plannedSeconds || 0), 0);
      const totalFocusHours = Number((totalFocusSeconds / 3600).toFixed(2));
      return {
        userId: user.id,
        fullName: user.fullName,
        totalFocusHours,
      };
    })
    .sort((a, b) => {
      if (b.totalFocusHours !== a.totalFocusHours) return b.totalFocusHours - a.totalFocusHours;
      return a.fullName.localeCompare(b.fullName);
    })
    .map((item, index) => ({
      ...item,
      rankPosition: index + 1,
      rankLevel: getRankLevel(item.totalFocusHours),
    }));

  await Promise.all(
    ranked.map((entry) =>
      prisma.ranking.upsert({
        where: { userId: entry.userId },
        update: {
          totalFocusHours: entry.totalFocusHours,
          rankPosition: entry.rankPosition,
          rankLevel: entry.rankLevel,
        },
        create: {
          userId: entry.userId,
          totalFocusHours: entry.totalFocusHours,
          rankPosition: entry.rankPosition,
          rankLevel: entry.rankLevel,
        },
      })
    )
  );

  return ranked;
}

async function getRankingsSnapshot() {
  const now = Date.now();
  if (rankingsCache.ranked.length && now < rankingsCache.expiresAt) {
    return rankingsCache.ranked;
  }
  if (rankingsCache.refreshPromise) {
    return rankingsCache.refreshPromise;
  }

  rankingsCache.refreshPromise = buildAndPersistRankings()
    .then((ranked) => {
      rankingsCache = {
        ranked,
        expiresAt: Date.now() + RANKINGS_CACHE_TTL_MS,
        refreshPromise: null,
      };
      return ranked;
    })
    .catch((error) => {
      rankingsCache.refreshPromise = null;
      throw error;
    });

  return rankingsCache.refreshPromise;
}

app.use(cors());
app.use(express.json());

app.post('/users/create', async (req, res) => {
  const { fullName } = req.body || {};
  const normalizedName = String(fullName || '').trim();
  if (!normalizedName) {
    return res.status(400).json({ error: 'fullName is required' });
  }

  try {
    const created = await prisma.user.create({
      data: { fullName: normalizedName, firstTime: true, signedIn: false },
      select: { id: true, fullName: true, firstTime: true, signedIn: true },
    });
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ error: 'create_user_failed' });
  }
});

app.post('/auth/name-login', async (req, res) => {
  const { fullName } = req.body || {};
  const normalizedName = String(fullName || '').trim();
  if (!normalizedName) {
    return res.status(400).json({ error: 'fullName is required' });
  }

  const existing = await prisma.user.findFirst({
    where: { fullName: normalizedName },
    orderBy: { createdAt: 'desc' },
    select: { id: true, fullName: true, firstTime: true, signedIn: true },
  });

  if (existing) {
    return res.json(existing);
  }

  const created = await prisma.user.create({
    data: { fullName: normalizedName, signedIn: false },
    select: { id: true, fullName: true, firstTime: true, signedIn: true },
  });

  return res.status(201).json(created);
});

app.get('/auth/users/:id/first-time', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, firstTime: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'user_not_found' });
  }

  return res.json(user);
});

app.get('/auth/users/:id/sign-in-state', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, signedIn: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'user_not_found' });
  }

  return res.json(user);
});

app.get('/auth/users/:id/profile', async (req, res) => {
  const { id } = req.params;
  const [user, completedStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        signedIn: true,
        createdAt: true,
      },
    }),
    prisma.focusSession.aggregate({
      where: {
        userId: id,
        status: 'COMPLETED',
        quitted: false,
      },
      _count: { _all: true },
      _sum: { plannedSeconds: true },
    }),
  ]);

  if (!user) {
    return res.status(404).json({ error: 'user_not_found' });
  }

  const totalSessions = Number(completedStats._count?._all || 0);
  const totalFocusSeconds = Number(completedStats._sum?.plannedSeconds || 0);
  const totalFocusMinutes = Math.round(totalFocusSeconds / 60);
  const avgSessionMinutes = totalSessions ? Math.round(totalFocusMinutes / totalSessions) : 0;

  return res.json({
    ...user,
    totalSessions,
    avgSessionMinutes,
  });
});

app.put('/auth/users/:id/profile', async (req, res) => {
  const { id } = req.params;
  const fullName = String(req.body?.fullName || '').trim();
  const emailInput = String(req.body?.email || '').trim().toLowerCase();
  const email = emailInput || null;

  if (!fullName) {
    return res.status(400).json({ error: 'fullName is required' });
  }

  try {
    if (email) {
      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existing && existing.id !== id) {
        return res.status(409).json({ error: 'email already exists' });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        email,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        signedIn: true,
        createdAt: true,
      },
    });

    return res.json(updated);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'user_not_found' });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: 'profile_conflict' });
    }
    return res.status(500).json({ error: 'profile_update_failed' });
  }
});

app.post('/auth/complete-first-time', async (req, res) => {
  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { firstTime: false },
    select: { id: true, fullName: true, firstTime: true },
  });

  return res.json(user);
});

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ ok: true, db: 'connected' });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'database_unreachable' });
  }
});

app.post('/feedback', async (req, res) => {
  const { userId, message } = req.body || {};
  const cleanMessage = String(message || '').trim();
  if (!userId || !cleanMessage) {
    return res.status(400).json({ error: 'userId and message are required' });
  }
  if (cleanMessage.length < 5) {
    return res.status(400).json({ error: 'feedback_too_short' });
  }

  const created = await prisma.feedback.create({
    data: {
      userId,
      message: cleanMessage,
    },
    select: {
      id: true,
      userId: true,
      message: true,
      createdAt: true,
    },
  });

  return res.status(201).json(created);
});

app.post('/auth/signup', async (_req, res) => {
  return res.status(410).json({ error: 'deprecated_use_supabase_auth' });
});

app.post('/auth/login', async (_req, res) => {
  return res.status(410).json({ error: 'deprecated_use_supabase_auth' });
});

app.post('/auth/supabase-sync', async (req, res) => {
  try {
    const payload = await verifySupabaseTokenFromRequest(req);
    const supabaseAuthId = String(payload.sub || '');
    const rawEmail = payload.email || payload.user_metadata?.email;
    const email = rawEmail ? String(rawEmail).toLowerCase() : null;
    const fullNameFromBody = String(req.body?.fullName || '').trim();
    const fullNameFromToken = String(payload.user_metadata?.full_name || '').trim();
    const fullNameFromEmail = email ? email.split('@')[0] : '';
    const fullName = fullNameFromBody || fullNameFromToken || fullNameFromEmail || 'FocusX User';

    if (!supabaseAuthId) {
      return res.status(401).json({ error: 'invalid_supabase_token' });
    }

    const existingByAuthId = await prisma.user.findUnique({
      where: { supabaseAuthId },
      select: { id: true, fullName: true, email: true },
    });

    if (existingByAuthId) {
      const updated = await prisma.user.update({
        where: { id: existingByAuthId.id },
        data: {
          signedIn: true,
          fullName: fullName || existingByAuthId.fullName,
          email: email || existingByAuthId.email,
        },
        select: { id: true, fullName: true, email: true, signedIn: true },
      });
      return res.json(updated);
    }

    if (email) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existingByEmail) {
        const linked = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            supabaseAuthId,
            signedIn: true,
            fullName,
          },
          select: { id: true, fullName: true, email: true, signedIn: true },
        });
        return res.json(linked);
      }
    }

    const created = await prisma.user.create({
      data: {
        supabaseAuthId,
        fullName,
        email,
        passwordHash: null,
        signedIn: true,
        firstTime: false,
      },
      select: { id: true, fullName: true, email: true, signedIn: true },
    });
    return res.status(201).json(created);
  } catch (error) {
    if (
      error?.message === 'missing_bearer_token' ||
      error?.message === 'invalid_supabase_token' ||
      isJwtVerificationFailed(error)
    ) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    if (error?.message === 'supabase_auth_not_configured') {
      return res.status(500).json({ error: 'supabase_auth_not_configured' });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({ error: 'database_error', code: error.code });
    }
    return res.status(500).json({ error: 'supabase_sync_failed' });
  }
});

app.post('/auth/supabase-logout', async (req, res) => {
  try {
    const payload = await verifySupabaseTokenFromRequest(req);
    const supabaseAuthId = String(payload.sub || '');
    if (!supabaseAuthId) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    await prisma.user.updateMany({
      where: { supabaseAuthId },
      data: { signedIn: false },
    });
    return res.json({ ok: true });
  } catch (error) {
    if (error?.message === 'missing_bearer_token' || isJwtVerificationFailed(error)) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    return res.status(500).json({ error: 'logout_failed' });
  }
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
      quitted: false,
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
      quitted: true,
      endedAt: new Date(),
    },
  });

  return res.json(session);
});

app.get('/analytics/:userId', async (req, res) => {
  const { userId } = req.params;
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    totalStartedSessions,
    successfulStats,
    failedSessionCount,
    todaySuccessfulStats,
  ] = await Promise.all([
    prisma.focusSession.count({ where: { userId } }),
    prisma.focusSession.aggregate({
      where: { userId, status: 'COMPLETED', quitted: false },
      _count: { _all: true },
      _sum: { plannedSeconds: true },
      _max: { plannedSeconds: true },
    }),
    prisma.focusSession.count({ where: { userId, status: 'ABANDONED' } }),
    prisma.focusSession.aggregate({
      where: {
        userId,
        status: 'COMPLETED',
        quitted: false,
        startedAt: { gte: last24Hours },
      },
      _sum: { plannedSeconds: true },
    }),
  ]);

  const successfulCompletedSessions = Number(successfulStats._count?._all || 0);
  const totalFocusSeconds = Number(successfulStats._sum?.plannedSeconds || 0);
  const totalFocusMinutes = Math.round(totalFocusSeconds / 60);
  const todayFocusSeconds = Number(todaySuccessfulStats._sum?.plannedSeconds || 0);
  const todayFocusMinutes = Math.round(todayFocusSeconds / 60);
  const longestSessionMinutes = successfulCompletedSessions
    ? Math.round(Number(successfulStats._max?.plannedSeconds || 0) / 60)
    : 0;
  const totalFocusHours = Number((totalFocusMinutes / 60).toFixed(1));

  return res.json({
    completedStreaks: successfulCompletedSessions,
    todayFocusMinutes,
    totalSessions: successfulCompletedSessions,
    totalFocusMinutes,
    avgSessionMinutes: successfulCompletedSessions
      ? Math.round(totalFocusMinutes / successfulCompletedSessions)
      : 0,
    totalStartedSessions,
    successfulCompletedSessions,
    failedSessions: Number(failedSessionCount || 0),
    longestSessionMinutes,
    totalFocusHours,
  });
});

app.get('/rankings/:userId', async (req, res) => {
  const { userId } = req.params;
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize || 10)));
  const ranked = await getRankingsSnapshot();
  const total = ranked.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  const leaderboard = ranked.slice(start, end).map((entry) => ({
    userId: entry.userId,
    fullName: entry.fullName,
    totalFocusHours: entry.totalFocusHours,
    rankPosition: entry.rankPosition,
    rankLevel: entry.rankLevel,
  }));

  const currentUserRank =
    ranked.find((entry) => entry.userId === userId) || {
      userId,
      fullName: 'YOU',
      totalFocusHours: 0,
      rankPosition: ranked.length + 1,
      rankLevel: 'INITIATE',
    };

  return res.json({
    rankLevels: RANK_LEVELS,
    leaderboard,
    currentUserRank,
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
    },
  });
});

export default app;
