import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter
// For production, consider using Redis for distributed rate limiting

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests, message = 'Too many requests, please try again later.' } = config;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Get client identifier (IP address or user ID from token)
    const identifier = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';

    const now = Date.now();
    const key = `${identifier}`;

    // Initialize or get current rate limit data
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return null; // Allow request
    }

    // Increment request count
    store[key].count++;

    // Check if limit exceeded
    if (store[key].count > maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);

      return NextResponse.json(
        {
          error: message,
          retryAfter: `${retryAfter} seconds`
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(store[key].resetTime).toISOString(),
          }
        }
      );
    }

    // Add rate limit headers
    return null; // Allow request, but we'll add headers in the actual route
  };
}

export function getRateLimitHeaders(identifier: string, config: RateLimitConfig) {
  const data = store[identifier];
  if (!data) {
    return {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': config.maxRequests.toString(),
    };
  }

  const remaining = Math.max(0, config.maxRequests - data.count);
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(data.resetTime).toISOString(),
  };
}
