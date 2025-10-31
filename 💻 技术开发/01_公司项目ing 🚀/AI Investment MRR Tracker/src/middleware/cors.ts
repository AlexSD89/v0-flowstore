import cors from 'cors';

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) {
      return callback(null, true);
    }

    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3000',
      'https://localhost:3001',
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      // Add your production domains here
      'https://your-domain.com',
      'https://api.your-domain.com'
    ].filter(Boolean); // Remove undefined values

    // Development: Allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Production: Check allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  
  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
  ],
  
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'X-Client-Version',
    'X-Request-ID'
  ],
  
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'X-Request-ID',
    'X-Response-Time'
  ],
  
  credentials: true, // Allow cookies and authorization headers
  
  maxAge: 86400, // Cache preflight response for 24 hours
  
  preflightContinue: false,
  optionsSuccessStatus: 204
};

export const corsMiddleware = cors(corsOptions);

// Custom CORS error handler
export const corsErrorHandler = (error: any, req: any, res: any, next: any) => {
  if (error.message && error.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CORS_ERROR',
        message: 'Cross-Origin Request Blocked',
        details: 'Your origin is not allowed to access this API'
      },
      timestamp: new Date().toISOString()
    });
  }
  next(error);
};