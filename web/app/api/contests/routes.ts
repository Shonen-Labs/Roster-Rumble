/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import amqp from 'amqplib';
import { getRedisClient } from '@/lib/redis';

const DATABASE_URL = process.env.DATABASE_URL!;
const JWT_SECRET = process.env.JWT_SECRET!;
const RABBITMQ_URL = process.env.RABBITMQ_URL!;

if (!DATABASE_URL || !JWT_SECRET || !RABBITMQ_URL) {
  throw new Error('Missing required environment variables.');
}

// PostgreSQL pool
export const pool = new Pool({ connectionString: DATABASE_URL });

// Zod schema for request body (POST)
const contestSchema = z.object({
  sport: z.string(),
  entryFee: z.number().nonnegative(),
  startsAt: z.string().refine((date: string) => !isNaN(Date.parse(date)), {
    message: 'Invalid ISO8601 date string',
  }),
  maxPlayers: z.number().int().positive(),
});

// Zod schema for query params (GET)
const contestQuerySchema = z.object({
  sport: z.string().optional(),
  minFee: z.coerce.number().nonnegative().optional(),
  maxFee: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

type ContestInput = z.infer<typeof contestSchema>;
type ContestQuery = z.infer<typeof contestQuerySchema>;

// Helper: verify JWT and check admin
export function verifyAdmin(token: string | undefined) {
  if (!token) {
    throw new Error('No token provided');
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== 'admin') {
      throw new Error('Forbidden');
    }
    return payload;
  } catch (err) {
    throw err;
  }
}

// Connect to RabbitMQ once
export let mqChannel: amqp.Channel;
export async function getMqChannel() {
  if (mqChannel) return mqChannel;
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertExchange('contest.events', 'fanout', { durable: true });
  mqChannel = channel;
  return mqChannel;
}

// GET /contests - List contests with filters and pagination
export async function GET(req: NextRequest) {
  let client;
  try {
    const { searchParams } = new URL(req.url);

    // Build query params object
    const rawQuery: Record<string, string> = {};
    for (const key of ['sport', 'minFee', 'maxFee', 'page', 'limit'] as const) {
      const v = searchParams.get(key);
      if (v !== null) rawQuery[key] = v;
    }

    // Validate query params
    let queryParams: ContestQuery;
    try {
      queryParams = contestQuerySchema.parse(rawQuery);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid query parameters', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }

    const cacheKey = `contests:${JSON.stringify(queryParams)}`;

    // Try Redis cache
    try {
      const redis = await getRedisClient();
      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as {
          contests: Array<Record<string, any>>;
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
        // Convert startsAt back to Date objects
        parsed.contests = parsed.contests.map((c) => ({
          ...c,
          startsAt: new Date(c.startsAt),
        }));
        return NextResponse.json(parsed, { status: 200 });
      }
    } catch (cacheErr) {
      console.warn('Redis cache error, proceeding without cache:', cacheErr);
    }

    // Build SQL query with filters
    client = await pool.connect();
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (queryParams.sport) {
      conditions.push(`sport = $${paramIndex}`);
      values.push(queryParams.sport);
      paramIndex++;
    }
    if (queryParams.minFee !== undefined) {
      conditions.push(`entry_fee >= $${paramIndex}`);
      values.push(Number(queryParams.minFee));
      paramIndex++;
    }
    if (queryParams.maxFee !== undefined) {
      conditions.push(`entry_fee <= $${paramIndex}`);
      values.push(Number(queryParams.maxFee));
      paramIndex++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) AS total FROM contests ${whereClause}`;
    const countResult = await client.query(countQuery, values);
    if (!countResult.rows || !countResult.rows[0]) {
      throw new Error('Failed to retrieve total count');
    }
    const total = countResult.rows[0] ? parseInt(countResult.rows[0].total || '0', 10) : 0;

    // Get paginated data
    const offset = (queryParams.page - 1) * queryParams.limit;
    const dataQuery = `
      SELECT
        id,
        sport,
        entry_fee AS "entryFee",
        prize_pool AS "prizePool",
        participants,
        starts_at AS "startsAt"
      FROM contests
      ${whereClause}
      ORDER BY starts_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await client.query(dataQuery, [...values, queryParams.limit, offset]);

    const response = {
      contests: dataResult.rows || [],
      total,
      page: queryParams.page,
      limit: queryParams.limit,
      totalPages: Math.ceil(total / queryParams.limit) || 1,
    };

    // Cache the result
    try {
      const redis = await getRedisClient();
      await redis.setEx(cacheKey, 30, JSON.stringify(response));
    } catch (cacheErr) {
      console.warn('Failed to cache result:', cacheErr);
    }

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    console.error('GET /contests error:', err.message, err.stack);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (client) {
      try {
        await client.release();
      } catch (releaseErr) {
        console.warn('Failed to release client:', releaseErr);
      }
    }
  }
}

// POST /contests - Create new contest
export async function POST(req: NextRequest) {
  let client;
  try {
    // Admin JWT from Authorization header
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    verifyAdmin(token);

    const body = await req.json();
    const parsed: ContestInput = contestSchema.parse(body);

    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO contests (sport, entry_fee, starts_at, max_players)
       VALUES ($1, $2, $3, $4)
       RETURNING id, sport, entry_fee AS "entryFee", starts_at AS "startsAt", max_players AS "maxPlayers";`,
      [parsed.sport, parsed.entryFee, parsed.startsAt, parsed.maxPlayers]
    );
    const contest = result.rows[0];

    // Emit event
    const channel = await getMqChannel();
    const eventPayload = Buffer.from(JSON.stringify({ type: 'ContestCreated', data: contest }));
    channel.publish('contest.events', '', eventPayload);

    // Invalidate cache after creating new contest
    try {
      const redis = await getRedisClient();
      const keys = await redis.keys('contests:*');
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (cacheError) {
      console.warn('Failed to invalidate cache:', cacheError);
    }

    return NextResponse.json(contest, { status: 201 });
  } catch (err: any) {
    if (err.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    if (err.message === 'No token provided') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('POST /contests error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (client) {
      try {
        await client.release();
      } catch (releaseErr) {
        console.warn('Failed to release client:', releaseErr);
      }
    }
  }
}