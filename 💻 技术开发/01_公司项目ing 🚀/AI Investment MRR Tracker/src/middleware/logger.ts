import { Request, Response, NextFunction } from 'express';

export interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  responseTime?: number;
  userAgent?: string;
  ip?: string;
  userId?: string;
  contentLength?: number;
  query?: any;
  body?: any;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Capture original end function
  const originalEnd = res.end;
  
  // Override end function to log response
  res.end = function(chunk?: any, encoding?: any) {
    const responseTime = Date.now() - startTime;
    const contentLength = res.get('content-length') || (chunk ? chunk.length : 0);
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      responseTime,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: (req as any).user?.id,
      contentLength: parseInt(contentLength as string, 10) || 0,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
      body: shouldLogBody(req) ? sanitizeBody(req.body) : undefined
    };

    // Log based on status code
    if (res.statusCode >= 500) {
      console.error('🚨 Server Error:', formatLogEntry(logEntry));
    } else if (res.statusCode >= 400) {
      console.warn('⚠️  Client Error:', formatLogEntry(logEntry));
    } else if (res.statusCode >= 300) {
      console.info('🔄 Redirect:', formatLogEntry(logEntry));
    } else {
      console.log('✅ Success:', formatLogEntry(logEntry));
    }

    // Store in database for analytics (async, don't wait)
    if (process.env.ENABLE_REQUEST_ANALYTICS === 'true') {
      storeLogEntry(logEntry).catch(err => {
        console.error('Failed to store log entry:', err);
      });
    }
    
    // Call original end function
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

const shouldLogBody = (req: Request): boolean => {
  // Don't log sensitive endpoints
  const sensitiveEndpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/password'];
  if (sensitiveEndpoints.some(endpoint => req.path.includes(endpoint))) {
    return false;
  }

  // Don't log large payloads
  const contentLength = parseInt(req.get('content-length') || '0', 10);
  if (contentLength > 10000) { // 10KB limit
    return false;
  }

  // Only log for development
  return process.env.NODE_ENV === 'development';
};

const sanitizeBody = (body: any): any => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'auth'];
  const sanitized = { ...body };

  const sanitizeObject = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeObject(item));
    }
    
    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          result[key] = '[REDACTED]';
        } else {
          result[key] = sanitizeObject(value);
        }
      }
      return result;
    }
    
    return obj;
  };

  return sanitizeObject(sanitized);
};

const formatLogEntry = (entry: LogEntry): string => {
  const statusEmoji = entry.status ? getStatusEmoji(entry.status) : '';
  return [
    `${statusEmoji} ${entry.method} ${entry.url}`,
    `Status: ${entry.status}`,
    `Time: ${entry.responseTime}ms`,
    entry.userId ? `User: ${entry.userId}` : `IP: ${entry.ip}`,
    entry.contentLength ? `Size: ${entry.contentLength}b` : ''
  ].filter(Boolean).join(' | ');
};

const getStatusEmoji = (status: number): string => {
  if (status >= 500) return '🚨';
  if (status >= 400) return '⚠️';
  if (status >= 300) return '🔄';
  if (status >= 200) return '✅';
  return '📝';
};

const storeLogEntry = async (entry: LogEntry): Promise<void> => {
  try {
    // Here you would store the log entry in your database
    // For now, we'll just store in memory or a file
    // You could extend this to use your Prisma client
    
    // Example: Store in a log collection or table
    // await prisma.requestLog.create({ data: entry });
    
    // For development, you might want to store in a file
    if (process.env.NODE_ENV === 'development') {
      const fs = require('fs').promises;
      const logFile = 'logs/requests.log';
      await fs.appendFile(logFile, JSON.stringify(entry) + '\n').catch(() => {
        // Ignore file write errors
      });
    }
  } catch (error) {
    // Don't let logging errors affect the request
    console.error('Failed to store log entry:', error);
  }
};

// Performance monitoring middleware
export const performanceLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - startTime) / 1000000; // Convert to milliseconds
    
    // Log slow requests
    if (duration > 1000) { // Requests slower than 1 second
      console.warn(`🐌 Slow Request: ${req.method} ${req.url} took ${duration.toFixed(2)}ms`);
    }
    
    // Log memory usage for heavy requests
    if (duration > 500) {
      const memUsage = process.memoryUsage();
      console.info('📊 Memory Usage:', {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
      });
    }
  });
  
  next();
};

// Structured logging utility
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`ℹ️  ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta, null, 2) : '');
  },
  
  warn: (message: string, meta?: any) => {
    console.warn(`⚠️  ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta, null, 2) : '');
  },
  
  error: (message: string, error?: any, meta?: any) => {
    console.error(`🚨 ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error('Error details:', error.stack || error);
    }
    if (meta) {
      console.error('Additional context:', JSON.stringify(meta, null, 2));
    }
  },
  
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta, null, 2) : '');
    }
  }
};