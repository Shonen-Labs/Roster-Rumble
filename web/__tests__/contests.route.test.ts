/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => {
      const status = init?.status ?? 200;
      return {
        status,
        async json() {
          return data;
        },
      };
    },
  },
}));

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// Simple Headers shim
class Headers {
  private map = new Map<string, string>();
  constructor(init?: Record<string, string>) {
    if (init) {
      for (const k in init) this.map.set(k.toLowerCase(), init[k]);
    }
  }
  has(name: string) {
    return this.map.has(name.toLowerCase());
  }
  get(name: string) {
    return this.map.get(name.toLowerCase()) ?? null;
  }
  set(name: string, value: string) {
    this.map.set(name.toLowerCase(), value);
  }
}

// Mocks for external libs
jest.mock('pg');
jest.mock('amqplib');
jest.mock('jsonwebtoken');
jest.mock('@/lib/redis');

import jwt from 'jsonwebtoken';
import amqp from 'amqplib';
import { PoolClient, QueryResult } from 'pg';
import { Channel } from 'amqplib';
import { mock } from 'jest-mock-extended';
import { getRedisClient } from '@/lib/redis';
import * as routeModule from '../app/api/contests/routes';

const { POST, GET, pool } = routeModule;

// Fake Redis client
const mockRedisClient = {
  get: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
};

// “NextRequest-lite” factory
function createNextRequest(
  url: string,
  opts: { method?: string; headers?: Record<string, string>; body?: string } = {}
) {
  const headers = new Headers(opts.headers);
  if (opts.method === 'POST' && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }
  return {
    url,
    method: opts.method ?? 'GET',
    headers,
    json: async () => (opts.body ? JSON.parse(opts.body) : {}),
  } as any;
}

describe('Contest API', () => {
  const fakeClient = mock<PoolClient>();
  const fakeChannel = mock<Channel>();

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    (pool.connect as jest.Mock).mockResolvedValue(fakeClient);
    (getRedisClient as jest.Mock).mockResolvedValue(mockRedisClient);

    (amqp.connect as jest.Mock).mockResolvedValue({
      createChannel: async () => fakeChannel,
      assertExchange: jest.fn(),
    });
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
    (console.warn as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset pool.connect to resolve fakeClient
    (pool.connect as jest.Mock).mockResolvedValue(fakeClient);
    (fakeClient.release as jest.Mock).mockResolvedValue(undefined);
    mockRedisClient.get.mockResolvedValue(null);
    mockRedisClient.setEx.mockResolvedValue('OK');
    mockRedisClient.del.mockResolvedValue(1);
    mockRedisClient.keys.mockResolvedValue([]);
    (fakeClient.query as jest.Mock).mockClear();
  });  

  describe('POST /api/contests', () => {
    it('returns 401 when no token provided', async () => {
      const req = createNextRequest('http://localhost/api/contests', {
        method: 'POST',
        body: JSON.stringify({
          sport: 'soccer',
          entryFee: 10,
          startsAt: new Date().toISOString(),
          maxPlayers: 8,
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: 'Unauthorized' });
    });

    it('returns 403 when role is not admin', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ role: 'user' });
      const req = createNextRequest('http://localhost/api/contests', {
        method: 'POST',
        headers: { authorization: 'Bearer sometoken' },
        body: JSON.stringify({
          sport: 'soccer',
          entryFee: 10,
          startsAt: new Date().toISOString(),
          maxPlayers: 8,
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ error: 'Forbidden' });
    });

    it('rejects invalid payloads with 400', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ role: 'admin' });
      const req = createNextRequest('http://localhost/api/contests', {
        method: 'POST',
        headers: { authorization: 'Bearer admintoken' },
        body: JSON.stringify({ sport: 'x', entryFee: -5 }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(Array.isArray(json.errors)).toBe(true);
      expect(json.errors.length).toBeGreaterThan(0);
    });

    it('inserts a valid contest and publishes event on admin token', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ role: 'admin' });
      const now = new Date().toISOString();
      const fakeRow = { id: 1, sport: 'tennis', entryFee: 15, startsAt: now, maxPlayers: 4 };
      (fakeClient.query as jest.Mock).mockResolvedValue({ rows: [fakeRow] } as QueryResult<any>);

      const req = createNextRequest('http://localhost/api/contests', {
        method: 'POST',
        headers: { authorization: 'Bearer admintoken' },
        body: JSON.stringify({ sport: 'tennis', entryFee: 15, startsAt: now, maxPlayers: 4 }),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
      expect(await res.json()).toEqual(fakeRow);

      expect(fakeClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO contests'),
        ['tennis', 15, now, 4]
      );
      expect(fakeChannel.publish).toHaveBeenCalledWith(
        'contest.events',
        '',
        Buffer.from(JSON.stringify({ type: 'ContestCreated', data: fakeRow }))
      );
    });

    it('invalidates cache after creating contest', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ role: 'admin' });
      mockRedisClient.keys.mockResolvedValue(['contests:{"page":1,"limit":20}']);

      const now = new Date().toISOString();
      const fakeRow = { id: 1, sport: 'tennis', entryFee: 15, startsAt: now, maxPlayers: 4 };
      (fakeClient.query as jest.Mock).mockResolvedValue({ rows: [fakeRow] } as QueryResult<any>);

      const req = createNextRequest('http://localhost/api/contests', {
        method: 'POST',
        headers: { authorization: 'Bearer admintoken' },
        body: JSON.stringify({ sport: 'tennis', entryFee: 15, startsAt: now, maxPlayers: 4 }),
      });

      await POST(req);
      expect(mockRedisClient.keys).toHaveBeenCalledWith('contests:*');
      expect(mockRedisClient.del).toHaveBeenCalledWith(['contests:{"page":1,"limit":20}']);
    });

    it('returns 500 on unexpected errors', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ role: 'admin' });
      (pool.connect as jest.Mock).mockRejectedValue(new Error('DB down'));

      const req = createNextRequest('http://localhost/api/contests', {
        method: 'POST',
        headers: { authorization: 'Bearer admintoken' },
        body: JSON.stringify({
          sport: 'basketball',
          entryFee: 20,
          startsAt: new Date().toISOString(),
          maxPlayers: 10,
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('GET /api/contests', () => {
    const mockContests = [
      {
        id: '1',
        sport: 'football',
        entryFee: 25,
        prizePool: 1000,
        participants: 10,
        startsAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        id: '2',
        sport: 'basketball',
        entryFee: 50,
        prizePool: 2000,
        participants: 8,
        startsAt: new Date('2024-01-16T14:00:00Z'),
      },
    ];

    beforeEach(() => {
      (fakeClient.query as jest.Mock).mockReset();
    });

    it('returns contests with default pagination', async () => {
      (fakeClient.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ total: '2' }] } as QueryResult<any>)
        .mockResolvedValueOnce({ rows: mockContests } as QueryResult<any>);

      const req = createNextRequest('http://localhost/api/contests', { method: 'GET' });
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        contests: mockContests,
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
      expect(fakeClient.query).toHaveBeenCalledTimes(2);
      expect(fakeClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) AS total FROM contests'),
        []
      );
      expect(fakeClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $1 OFFSET $2'),
        [20, 0]
      );
      expect(mockRedisClient.setEx).toHaveBeenCalledWith(
        expect.stringContaining('contests:'),
        30,
        expect.any(String)
      );
    });

    it('returns cached results when available', async () => {
      const cached = {
        contests: mockContests,
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(cached));

      const req = createNextRequest('http://localhost/api/contests', { method: 'GET' });
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(cached);
      expect(fakeClient.query).not.toHaveBeenCalled();
    });

    it('filters by sport', async () => {
      (fakeClient.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ total: '1' }] } as QueryResult<any>)
        .mockResolvedValueOnce({ rows: [mockContests[0]] } as QueryResult<any>);

      const req = createNextRequest('http://localhost/api/contests?sport=football', {
        method: 'GET',
      });
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.contests).toHaveLength(1);
      expect(json.contests[0].sport).toBe('football');
      expect(fakeClient.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE sport = $1'),
        ['football']
      );
    });

    it('filters by fee range', async () => {
      (fakeClient.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ total: '1' }] } as QueryResult<any>)
        .mockResolvedValueOnce({ rows: [mockContests[1]] } as QueryResult<any>);

      const req = createNextRequest('http://localhost/api/contests?minFee=30&maxFee=100', {
        method: 'GET',
      });
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(fakeClient.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE entry_fee >= $1 AND entry_fee <= $2'),
        [30, 100]
      );
    });

    it('handles pagination correctly', async () => {
      (fakeClient.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ total: '25' }] } as QueryResult<any>)
        .mockResolvedValueOnce({ rows: mockContests } as QueryResult<any>);

      const req = createNextRequest('http://localhost/api/contests?page=2&limit=10', {
        method: 'GET',
      });
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.page).toBe(2);
      expect(json.limit).toBe(10);
      expect(json.totalPages).toBe(3);
      expect(fakeClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $1 OFFSET $2'),
        [10, 10]
      );
    });

    it('returns 400 for invalid query parameters', async () => {
      const req = createNextRequest('http://localhost/api/contests?sport=invalid&page=0', {
        method: 'GET',
      });
      const res = await GET(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Invalid query parameters');
      expect(json.details).toBeDefined();
    });

    it('continues without cache on Redis errors', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Redis down'));
      (fakeClient.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ total: '2' }] } as QueryResult<any>)
        .mockResolvedValueOnce({ rows: mockContests } as QueryResult<any>);

      const req = createNextRequest('http://localhost/api/contests', { method: 'GET' });
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.contests).toEqual(mockContests);
      expect(fakeClient.query).toHaveBeenCalledTimes(2);
    });

    it('returns 500 on database errors', async () => {
      (pool.connect as jest.Mock).mockRejectedValue(new Error('DB connection failed'));

      const req = createNextRequest('http://localhost/api/contests', { method: 'GET' });
      const res = await GET(req);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Internal Server Error' });
    });

    it('combines multiple filters correctly', async () => {
      (fakeClient.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ total: '1' }] } as QueryResult<any>)
        .mockResolvedValueOnce({ rows: [mockContests[0]] } as QueryResult<any>);

      const req = createNextRequest(
        'http://localhost/api/contests?sport=football&minFee=20&maxFee=30',
        { method: 'GET' }
      );
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(fakeClient.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE sport = $1 AND entry_fee >= $2 AND entry_fee <= $3'),
        ['football', 20, 30]
      );
    });
  });
});

