import Redis from "ioredis"

// Singleton pattern to reuse the Redis connection across API routes
let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number.parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD,
      // Add any other configurations you need
      retryStrategy: (times) => {
        // Retry connection with exponential backoff
        const delay = Math.min(times * 50, 2000)
        return delay
      },
    })

    redis.on("error", (err) => {
      console.error("Redis connection error:", err)
      redis = null
    })

    redis.on("connect", () => {
      console.log("Connected to Redis")
    })
  }

  return redis
}

// Graceful shutdown - important for Next.js deployment environments
export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    await redis.quit()
    redis = null
  }
}
