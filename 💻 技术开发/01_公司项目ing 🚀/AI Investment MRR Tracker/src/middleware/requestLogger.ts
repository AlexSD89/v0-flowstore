import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

interface RequestWithTiming extends Request {
  startTime?: number;
}

export const requestLogger = (req: RequestWithTiming, res: Response, next: NextFunction): void => {
  const startTime = performance.now();
  req.startTime = startTime;
  
  const { method, url, ip } = req;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${new Date().toISOString()}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
  
  // Log request body for POST/PUT requests (excluding sensitive data)
  if ((method === 'POST' || method === 'PUT') && req.body) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields
    delete sanitizedBody.password;
    delete sanitizedBody.token;
    delete sanitizedBody.apiKey;
    
    if (Object.keys(sanitizedBody).length > 0) {
      console.log(`[${new Date().toISOString()}] Request body:`, JSON.stringify(sanitizedBody, null, 2));
    }
  }
  
  // Log response when it finishes
  const originalSend = res.send;
  res.send = function(data) {
    const endTime = performance.now();
    const duration = req.startTime ? Math.round(endTime - req.startTime) : 0;
    
    console.log(`[${new Date().toISOString()}] ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    
    // Log response body for errors or in development mode
    if (res.statusCode >= 400 || process.env.NODE_ENV === 'development') {
      try {
        const responseData = typeof data === 'string' ? JSON.parse(data) : data;
        console.log(`[${new Date().toISOString()}] Response:`, JSON.stringify(responseData, null, 2));
      } catch (e) {
        console.log(`[${new Date().toISOString()}] Response (raw):`, data);
      }
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Enhanced logging for specific routes
export const detailedLogger = (routeName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log(`[${new Date().toISOString()}] Entering ${routeName} route`);
    
    if (req.params && Object.keys(req.params).length > 0) {
      console.log(`[${new Date().toISOString()}] Route params:`, req.params);
    }
    
    if (req.query && Object.keys(req.query).length > 0) {
      console.log(`[${new Date().toISOString()}] Query params:`, req.query);
    }
    
    next();
  };
};

// Performance monitoring middleware
export const performanceMonitor = (req: RequestWithTiming, res: Response, next: NextFunction): void => {
  const startTime = performance.now();
  req.startTime = startTime;
  
  res.on('finish', () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log slow requests (> 1000ms)
    if (duration > 1000) {
      console.warn(`[SLOW REQUEST] ${req.method} ${req.url} took ${Math.round(duration)}ms`);
    }
    
    // Log memory usage for heavy requests
    if (duration > 500) {
      const memUsage = process.memoryUsage();
      console.log(`[MEMORY] ${req.method} ${req.url} - RSS: ${Math.round(memUsage.rss / 1024 / 1024)}MB, Heap: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
    }
  });
  
  next();
};