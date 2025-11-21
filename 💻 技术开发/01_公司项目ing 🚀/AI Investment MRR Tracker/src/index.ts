import { App } from './app';
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  try {
    const app = new App();
    const port = parseInt(process.env.PORT || '3001', 10);
    
    await app.start(port);
    
    console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║            🤖 AI Investment MRR Tracker API                ║
    ║                                                            ║
    ║  Port: ${port.toString().padEnd(50)}║
    ║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(43)}║
    ║  Database: ${(process.env.DATABASE_URL ? 'Connected' : 'Disconnected').padEnd(44)}║
    ║  Redis: ${(process.env.REDIS_URL ? 'Connected' : 'Disconnected').padEnd(47)}║
    ║                                                            ║
    ║  🔍 API Documentation: /api                                ║
    ║  📊 Health Check: /health                                  ║
    ║  🔐 Authentication: /api/auth                              ║
    ║                                                            ║
    ║  Ready for AI-powered investment analysis! 🚀             ║
    ╚════════════════════════════════════════════════════════════╝
    `);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

main();