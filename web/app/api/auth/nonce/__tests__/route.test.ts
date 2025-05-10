import { GET } from '../route';
import { NextRequest } from 'next/server';
import { getRedisClient, redis } from '@/lib/redis';
import { randomBytes } from 'crypto';

jest.mock('crypto', () => {
  let counter = 0;
  return {
    randomBytes: jest.fn().mockImplementation(() => {
      const buffer = Buffer.alloc(32);
      buffer.write(`test-nonce-${counter++}`.padEnd(32, '0'));
      return {
        toString: () => buffer.toString('hex'),
      };
    }),
  };
});

describe('Auth Nonce Endpoint', () => {
  beforeAll(async () => {
    try {
      await getRedisClient();
    } catch (error) {
      console.error('Failed to connect to Redis in beforeAll:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      const client = redis();
      if (client.isOpen) {
        await client.quit();
      }
    } catch (error) {
      console.error('Failed to disconnect Redis in afterAll:', error);
    }
  });

  afterEach(async () => {
    try {
      await redis().flushAll();
    } catch (error) {
      console.error('Failed to flush Redis in afterEach:', error);
    }
  });

  it('returns a 32-byte hex string nonce', async () => {
    const url = 'http://localhost/api/auth/nonce?walletAddress=0x123';
    const request = new NextRequest(url);
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toHaveProperty('nonce');
    expect(json.nonce).toMatch(/^[0-9a-f]{64}$/);
  });

  it('stores nonce in Redis with the correct key and TTL', async () => {
    const walletAddress = '0x123';
    const url = `http://localhost/api/auth/nonce?walletAddress=${walletAddress}`;
    const request = new NextRequest(url);
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toHaveProperty('nonce');

    const storedNonce = await redis().get(`auth:nonce:${walletAddress}`);
    expect(storedNonce).toBe(json.nonce);

    const ttl = await redis().ttl(`auth:nonce:${walletAddress}`);
    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(300);
  });

  it('returns different nonces for consecutive requests', async () => {
    const walletAddress = '0x123';
    const url = `http://localhost/api/auth/nonce?walletAddress=${walletAddress}`;
    
    const request1 = new NextRequest(url);
    const response1 = await GET(request1);
    const json1 = await response1.json();

    const request2 = new NextRequest(url);
    const response2 = await GET(request2);
    const json2 = await response2.json();

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(json1.nonce).not.toEqual(json2.nonce);
  });

  it('rejects requests without walletAddress parameter', async () => {
    const url = 'http://localhost/api/auth/nonce';
    const request = new NextRequest(url);
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty('error');
    expect(json.error).toBe('Wallet address is required');
  });
});