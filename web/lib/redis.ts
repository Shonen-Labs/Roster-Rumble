import { createClient, RedisClientType } from 'redis';

// Singleton instance of Redis client
let redisClient: RedisClientType | null = null;

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (!redisClient) {
    try {
      console.log('Creating Redis client with URL:', process.env.REDIS_URL || 'redis://127.0.0.1:6379');
      redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
        socket: {
          reconnectStrategy: (retries: number) => {
            // Exponential backoff: min(50ms * retries, 2000ms)
            const delay = Math.min(retries * 50, 2000);
            console.log(`Retrying Redis connection (attempt ${retries + 1}) after ${delay}ms`);
            return delay;
          },
        },
      });

      redisClient.on('error', (err) => {
        console.error('Redis client error:', err);
        redisClient = null; // Reset client on error to allow reconnection
      });

      redisClient.on('connect', () => {
        console.log('Redis client connected successfully');
      });

      redisClient.on('ready', () => {
        console.log('Redis client ready');
      });
    } catch (error) {
      console.error('Failed to create Redis client:', error);
      throw new Error(`Redis client creation failed: ${error}`);
    }
  }

  try {
    if (redisClient && !redisClient.isOpen) {
      console.log('Connecting to Redis...');
      await redisClient.connect();
    }
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    redisClient = null;
    throw new Error(`Redis connection failed: ${error}`);
  }
};

// Export a function to access the Redis client (for tests)
export const redis = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client is not initialized. Call getRedisClient first.');
  }
  return redisClient;
};

// Helper for graceful shutdown
export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    try {
      console.log('Disconnecting Redis client...');
      await redisClient.quit();
      console.log('Redis client disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
    }
    redisClient = null;
  }
};