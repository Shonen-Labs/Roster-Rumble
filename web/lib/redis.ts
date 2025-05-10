import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (!redisClient) {
    try {
      redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });

      redisClient.on('error', (err) => {
        console.error('Redis client error:', err);
        redisClient = null; 
      });
    } catch (error) {
      console.error('Failed to create Redis client:', error);
      throw error;
    }
  }

  try {
    if (redisClient && !redisClient.isOpen) {
      await redisClient.connect();
    }
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    redisClient = null;
    throw error;
  }
};

export const redis = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client is not initialized. Call getRedisClient first.');
  }
  return redisClient;
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.quit();
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
    }
    redisClient = null;
  }
};