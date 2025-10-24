import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/middleware/rateLimiter';

/**
 * Global API Rate Limiter
 *
 * Very lenient limits designed for multi-agent office environments:
 * - 1000 requests per 15 minutes per IP (67 req/min average)
 * - Allows bursts for high-speed agent work
 * - Multiple agents can work from same IP
 * - Prevents only severe abuse/attacks
 *
 * Use case examples that stay under limit:
 * - 5 agents working simultaneously from same office
 * - Each agent: 200 requests per 15 min = 1000 total
 * - Fast chat responses, quick tab switches, data lookups
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000, // 1000 requests per IP
  message: 'Rate limit exceeded. If you are experiencing issues, please contact support.',
});

/**
 * Apply rate limiting to API routes
 */
export async function applyRateLimit(request: NextRequest): Promise<NextResponse | null> {
  // Skip rate limiting for health checks
  if (request.nextUrl.pathname === '/api/health') {
    return null;
  }

  return await globalRateLimiter(request);
}
