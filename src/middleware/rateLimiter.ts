import { NextRequest, NextResponse } from 'next/server';
import IORedis from 'ioredis';

// Redis connection (lazy initialization)
let redisClient: IORedis | null = null;

function getRedisClient() {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      console.warn('REDIS_URL not configured, rate limiting disabled');
      return null;
    }

    redisClient = new IORedis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 200, 2000); // Wait 200ms, 400ms, 600ms
      },
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redisClient.on('error', (err) => {
      console.error('Redis rate limiter error:', err);
    });

    // Connect to Redis
    redisClient.connect().catch((err) => {
      console.error('Failed to connect to Redis:', err);
    });
  }

  return redisClient;
}

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
  skipFailedRequests?: boolean; // Don't count failed requests
}

/**
 * Redis-based rate limiter
 *
 * Limits are designed to prevent abuse while allowing high-speed agent work:
 * - Multiple agents can work from same IP
 * - Fast-paced conversations with multiple customers
 * - Quick tab switching and data lookups
 *
 * Default: 1000 requests per 15 minutes (67 req/min)
 * This allows ~1 request per second sustained, with bursts up to 1000
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please slow down.',
    skipFailedRequests = true
  } = config;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const redis = getRedisClient();

    // If Redis is not available, allow the request (fail open)
    if (!redis || redis.status !== 'ready') {
      console.warn('Rate limiting bypassed: Redis not available');
      return null;
    }

    try {
      // Get client identifier (IP address)
      const identifier =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'unknown';

      const now = Date.now();
      const windowStart = now - windowMs;
      const key = `ratelimit:${identifier}`;

      // Use Redis sorted set to track requests in time window
      // Score = timestamp, Value = unique request ID
      const requestId = `${now}:${Math.random()}`;

      // Start a Redis pipeline for atomic operations
      const pipeline = redis.pipeline();

      // 1. Remove old requests outside the window
      pipeline.zremrangebyscore(key, 0, windowStart);

      // 2. Add current request
      pipeline.zadd(key, now, requestId);

      // 3. Count requests in window
      pipeline.zcard(key);

      // 4. Set expiry on key (cleanup)
      pipeline.expire(key, Math.ceil(windowMs / 1000));

      const results = await pipeline.exec();

      if (!results) {
        // Pipeline failed, allow request
        return null;
      }

      // Get count from results (index 2 = zcard result)
      const countResult = results[2];
      const count = (countResult && countResult[1]) as number || 0;

      // Check if limit exceeded
      if (count > maxRequests) {
        const oldestRequest = await redis.zrange(key, 0, 0, 'WITHSCORES');
        const oldestTimestamp = oldestRequest[1] ? parseInt(oldestRequest[1]) : now;
        const resetTime = oldestTimestamp + windowMs;
        const retryAfter = Math.ceil((resetTime - now) / 1000);

        return NextResponse.json(
          {
            error: message,
            retryAfter: `${retryAfter} seconds`,
            limit: maxRequests,
            windowSeconds: Math.ceil(windowMs / 1000)
          },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(resetTime).toISOString(),
            }
          }
        );
      }

      // Request allowed
      return null;

    } catch (error) {
      // On error, fail open (allow request) but log the error
      console.error('Rate limit check failed:', error);
      return null;
    }
  };
}

/**
 * Get rate limit info for an identifier (for monitoring/debugging)
 */
export async function getRateLimitInfo(identifier: string, windowMs: number) {
  const redis = getRedisClient();

  if (!redis) {
    return { available: false };
  }

  try {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const count = await redis.zcount(key, windowStart, now);
    const ttl = await redis.ttl(key);

    return {
      available: true,
      count,
      ttl,
      windowMs
    };
  } catch (error) {
    console.error('Failed to get rate limit info:', error);
    return { available: false, error: String(error) };
  }
}

/**
 * Graceful shutdown - close Redis connection
 */
export async function closeRateLimiter() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
