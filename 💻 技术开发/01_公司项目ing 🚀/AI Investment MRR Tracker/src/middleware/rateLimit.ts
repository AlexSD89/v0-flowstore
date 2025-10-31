import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import { createError } from './errorHandler';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: Request) => string; // Custom key generator
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

class RateLimiter {
  private redis: any;
  private options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = options;
    this.redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.redis.on('error', (err: any) => {
      console.error('Rate Limiter Redis Error:', err);
    });

    this.redis.connect().catch((err: any) => {
      console.error('Failed to connect to Redis for rate limiting:', err);
    });
  }

  private getKey(req: Request): string {
    if (this.options.keyGenerator) {
      return this.options.keyGenerator(req);
    }
    
    // Default key: IP address + user ID (if authenticated)
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userId = (req as any).user?.id || 'anonymous';
    return `rate_limit:${ip}:${userId}`;
  }

  public middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const key = this.getKey(req);
        const window = Math.floor(Date.now() / this.options.windowMs);
        const redisKey = `${key}:${window}`;

        // Get current count
        const current = await this.redis.get(redisKey);
        const requests = current ? parseInt(current, 10) : 0;

        // Set headers
        res.set({
          'X-RateLimit-Limit': this.options.maxRequests.toString(),
          'X-RateLimit-Remaining': Math.max(0, this.options.maxRequests - requests - 1).toString(),
          'X-RateLimit-Reset': ((window + 1) * this.options.windowMs).toString()
        });

        if (requests >= this.options.maxRequests) {
          res.set('Retry-After', this.options.windowMs.toString());
          throw createError.tooManyRequests(
            `Rate limit exceeded. Try again in ${Math.ceil(this.options.windowMs / 1000)} seconds.`,
            'RATE_LIMIT_EXCEEDED'
          );
        }

        // Increment counter
        const multi = this.redis.multi();
        multi.incr(redisKey);
        multi.expire(redisKey, Math.ceil(this.options.windowMs / 1000));
        await multi.exec();

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

// Different rate limiters for different endpoints
export const generalRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000, // 1000 requests per 15 minutes
}).middleware();

export const strictRateLimit = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
}).middleware();

export const apiRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes per user
  keyGenerator: (req: Request) => {
    const userId = (req as any).user?.id || req.ip || 'anonymous';
    return `api_rate_limit:${userId}`;
  }
}).middleware();

export const aiAnalysisRateLimit = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50, // 50 AI analysis requests per hour per user
  keyGenerator: (req: Request) => {
    const userId = (req as any).user?.id || req.ip || 'anonymous';
    return `ai_analysis_rate_limit:${userId}`;
  }
}).middleware();

export const authRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 login attempts per 15 minutes per IP
  keyGenerator: (req: Request) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    return `auth_rate_limit:${ip}`;
  }
}).middleware();

// Default rate limit middleware
export const rateLimitMiddleware = generalRateLimit;