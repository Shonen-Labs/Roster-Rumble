/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import amqp from 'amqplib';

const DATABASE_URL = process.env.DATABASE_URL!;
const JWT_SECRET = process.env.JWT_SECRET!;
const RABBITMQ_URL = process.env.RABBITMQ_URL!;

if (!DATABASE_URL || !JWT_SECRET || !RABBITMQ_URL) {
  throw new Error('Missing required environment variables.');
}

// PostgreSQL pool
export const pool = new Pool({ connectionString: DATABASE_URL });

// Zod schema for request body
const contestSchema = z.object({
  sport: z.string(),
  entryFee: z.number().nonnegative(),
  startsAt: z.string().refine((date: string) => !isNaN(Date.parse(date)), {
    message: 'Invalid ISO8601 date string',
  }),
  maxPlayers: z.number().int().positive(),
});

type ContestInput = z.infer<typeof contestSchema>;

// Helper: verify JWT and check admin
export function verifyAdmin(token: string | undefined) {
  if (!token) {
    throw new Error('No token provided');
  }
  try {
    // JWT_SECRET is asserted as non-null
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
  // RABBITMQ_URL is asserted as non-null
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertExchange('contest.events', 'fanout', { durable: true });
  mqChannel = channel;
  return mqChannel;
}

export async function POST(req: NextRequest) {
  try {
    // Admin JWT from Authorization header
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    verifyAdmin(token);

    const body = await req.json();
    const parsed: ContestInput = contestSchema.parse(body);

    const client = await pool.connect();
    try {
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

      return NextResponse.json(contest, { status: 201 });
    } finally {
      client.release();
    }
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
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
