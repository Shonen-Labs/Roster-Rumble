/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// Mocks for external libs
jest.mock('pg');
jest.mock('amqplib');
jest.mock('jsonwebtoken');

import jwt from 'jsonwebtoken';
import amqp from 'amqplib';
import { NextRequest } from 'next/server';
import { PoolClient, QueryResult } from 'pg';
import { Channel } from 'amqplib';
import { mock } from 'jest-mock-extended';
import * as routeModule from '../app/api/contests/routes';

const { POST, pool } = routeModule;

describe('POST /api/contests', () => {
  const fakeClient = mock<PoolClient>();
  const fakeChannel = mock<Channel>();

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    (pool.connect as jest.Mock).mockResolvedValue(fakeClient);

    (amqp.connect as jest.Mock).mockResolvedValue({
      createChannel: async () => fakeChannel,
      assertExchange: jest.fn(),
    });
  });
  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (fakeClient.release as jest.Mock).mockResolvedValue(undefined);
  });

  it('returns 401 when no token provided', async () => {
    const req = new NextRequest('http://localhost/api/contests', {
      method: 'POST', headers: {},
      body: JSON.stringify({ sport: 'soccer', entryFee: 10, startsAt: new Date().toISOString(), maxPlayers: 8 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns 403 when role is not admin', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ role: 'user' });
    const req = new NextRequest('http://localhost/api/contests', {
      method: 'POST', headers: { authorization: 'Bearer sometoken' },
      body: JSON.stringify({ sport: 'soccer', entryFee: 10, startsAt: new Date().toISOString(), maxPlayers: 8 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: 'Forbidden' });
  });

  it('rejects invalid payloads with 400', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ role: 'admin' });
    const req = new NextRequest('http://localhost/api/contests', {
      method: 'POST', headers: { authorization: 'Bearer admintoken' },
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

    const req = new NextRequest('http://localhost/api/contests', {
      method: 'POST', headers: { authorization: 'Bearer admintoken' },
      body: JSON.stringify({ sport: 'tennis', entryFee: 15, startsAt: now, maxPlayers: 4 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(fakeRow);

    expect(fakeClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO contests'),
      ['tennis', 15, now, 4],
    );
    expect(fakeChannel.publish).toHaveBeenCalledWith(
      'contest.events', '', Buffer.from(JSON.stringify({ type: 'ContestCreated', data: fakeRow })),
    );
  });

  it('returns 500 on unexpected errors', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ role: 'admin' });
    (pool.connect as jest.Mock).mockRejectedValue(new Error('DB down'));

    const req = new NextRequest('http://localhost/api/contests', {
      method: 'POST', headers: { authorization: 'Bearer admintoken' },
      body: JSON.stringify({ sport: 'basketball', entryFee: 20, startsAt: new Date().toISOString(), maxPlayers: 10 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Internal Server Error' });
  });
});
