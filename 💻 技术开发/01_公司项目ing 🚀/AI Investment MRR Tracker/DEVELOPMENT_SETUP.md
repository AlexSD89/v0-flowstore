# AI Investment MRR Tracker - Development Setup Guide

## 📋 Overview

This document provides comprehensive setup instructions for the AI Investment MRR Tracker development environment. The project uses enterprise-grade TypeScript configuration with strict type checking, automated testing, code formatting, and Docker containerization.

## 🛠️ Technology Stack

### Core Technologies
- **TypeScript 5.6+** - Strict mode with enterprise-grade type safety
- **Next.js 15** - React framework with App Router
- **Prisma** - Database ORM with PostgreSQL
- **Redis** - Caching and session storage
- **LangChain** - AI/ML integration framework

### Development Tools
- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting with import sorting
- **Jest** - Testing framework with TypeScript support
- **Husky** - Git hooks for code quality gates
- **Docker** - Containerization for consistent environments

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- Docker and Docker Compose
- Git

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd ai-investment-mrr-tracker

# Install dependencies
npm install

# Install Husky git hooks
npm run prepare
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

### 3. Database Setup
```bash
# Start PostgreSQL and Redis with Docker
docker-compose -f docker-compose.dev.yml up -d postgres-dev redis-dev

# Run database migrations
npm run db:migrate

# Seed database with initial data
npm run db:seed
```

### 4. Development Server
```bash
# Start development server with hot reload
npm run dev

# The application will be available at http://localhost:3000
```

## 📁 Project Structure

```
ai-investment-mrr-tracker/
├── src/                          # Source code
│   ├── components/              # React components
│   ├── lib/                     # Utility libraries
│   ├── types/                   # TypeScript type definitions
│   ├── repositories/            # Data access layer
│   ├── services/               # Business logic services
│   ├── collectors/             # Data collection modules
│   ├── analyzers/              # Investment analysis logic
│   └── scorers/                # Scoring algorithms
├── prisma/                      # Database schema and migrations
├── __tests__/                   # Test files
├── .vscode/                     # VS Code configuration
├── .husky/                      # Git hooks
└── docker/                      # Docker configurations
```

## 🔧 Configuration Files

### TypeScript Configuration (`tsconfig.json`)
- **Strict mode** with comprehensive type checking
- **Path mapping** for clean imports (`@/components`, `@/lib`, etc.)
- **Enterprise-grade settings** for maximum type safety
- **Next.js optimization** with bundler module resolution

### ESLint Configuration (`eslint.config.js`)
- **TypeScript-first** rules with strict type checking
- **Next.js best practices** and React hooks
- **Import organization** and consistency rules
- **Accessibility (a11y)** rules for inclusive development

### Prettier Configuration (`.prettierrc.js`)
- **Consistent formatting** across the codebase
- **Import sorting** with logical grouping
- **Tailwind CSS** class organization
- **File-specific** formatting rules

### Jest Configuration (`jest.config.js`)
- **TypeScript support** with ts-jest
- **Next.js integration** with next/jest
- **Path mapping** aligned with tsconfig.json
- **Comprehensive mocking** for external dependencies

## 🐳 Docker Development

### Development Environment
```bash
# Start full development stack
docker-compose -f docker-compose.dev.yml up

# Start with database management tools
docker-compose -f docker-compose.dev.yml --profile tools up

# Run tests in Docker
docker-compose -f docker-compose.dev.yml --profile test up test-runner
```

### Production Environment
```bash
# Build and start production stack
docker-compose up --profile prod

# Start with monitoring
docker-compose up --profile prod --profile monitoring
```

### Available Services
- **Application**: http://localhost:3000
- **Database**: PostgreSQL on port 5433
- **Cache**: Redis on port 6380
- **PgAdmin**: http://localhost:8080 (admin/admin)
- **Redis Commander**: http://localhost:8081 (admin/admin)

## 🧪 Testing Strategy

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Integration Tests
```bash
# Start test database
docker-compose -f docker-compose.dev.yml up postgres-test

# Run integration tests
npm run test:integration
```

### End-to-End Tests
```bash
# Start full development stack
npm run dev

# Run E2E tests (if configured)
npm run test:e2e
```

## 📏 Code Quality Standards

### Pre-commit Hooks
- **Type checking** - Ensures TypeScript compilation
- **Linting** - ESLint rules enforcement
- **Formatting** - Prettier code formatting
- **Testing** - Runs relevant tests
- **Commit message** - Conventional commit format

### Commit Message Format
```
type(scope): description

feat: add investment score calculation
fix(api): resolve MRR data validation error
docs: update setup instructions
refactor(database): optimize repository queries
```

### Code Coverage Requirements
- **Statements**: 70%+
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+

## 🔍 Development Workflow

### Daily Development
1. **Pull latest changes**: `git pull origin main`
2. **Install dependencies**: `npm install`
3. **Start development**: `npm run dev`
4. **Run tests**: `npm test`
5. **Commit changes**: Follow conventional commits

### Feature Development
1. **Create feature branch**: `git checkout -b feat/investment-scoring`
2. **Develop with TDD**: Write tests first, then implementation
3. **Type safety**: Ensure all code is properly typed
4. **Code review**: Create pull request with comprehensive description
5. **Integration**: Merge after approval and CI passes

### Database Changes
1. **Create migration**: `npm run db:migrate`
2. **Update schema**: Edit `prisma/schema.prisma`
3. **Generate client**: `npm run db:generate`
4. **Test changes**: Run integration tests
5. **Document**: Update database documentation

## 📊 Monitoring and Debugging

### Development Tools
- **Next.js DevTools**: Browser extension for React debugging
- **Prisma Studio**: Database GUI at `npm run db:studio`
- **TypeScript errors**: Real-time in VS Code
- **ESLint warnings**: Integrated in editor

### Debug Configuration
VS Code launch configurations are provided for:
- **Next.js debugging** (server and client)
- **Jest test debugging**
- **Node.js script debugging**
- **Database scripts** debugging

### Logging
```typescript
// Use structured logging
import { logger } from '@/lib/logger';

logger.info('Investment analysis started', {
  companyId,
  userId,
  timestamp: new Date().toISOString()
});
```

## 🔐 Security Best Practices

### Environment Variables
- **Never commit** `.env` files
- **Use `.env.local`** for development
- **Validate environment** variables at startup
- **Rotate secrets** regularly

### Type Safety
- **Strict TypeScript** mode enabled
- **No `any` types** allowed
- **Zod validation** for external data
- **Input sanitization** for user data

### Dependencies
- **Regular updates** with `npm audit`
- **Security scanning** with Snyk
- **License compliance** checking
- **Dependency review** for new packages

## 🚀 Deployment

### Development Deployment
```bash
# Build application
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build production image
docker build -t ai-mrr-tracker .

# Run production container
docker run -p 3000:3000 ai-mrr-tracker
```

### Environment-Specific Configuration
- **Development**: `.env.development`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

## 📚 Additional Resources

### Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

### Project-Specific
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Architecture Overview](./docs/architecture.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🆘 Troubleshooting

### Common Issues

#### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf .next .tsbuildinfo
npm run type-check
```

#### Database Connection
```bash
# Reset database
npm run db:reset

# Check connection
npm run db:studio
```

#### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### Docker Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild containers
docker-compose build --no-cache
```

### Getting Help
- **Create an issue** on GitHub
- **Check documentation** in `/docs` folder
- **Review error logs** in development console
- **Ask in team chat** or code review

---

## 📝 Summary

This development environment provides enterprise-grade TypeScript development with:

✅ **Strict TypeScript** configuration with maximum type safety  
✅ **Comprehensive testing** setup with Jest and coverage reporting  
✅ **Code quality gates** with ESLint, Prettier, and Husky hooks  
✅ **Docker containerization** for consistent development and deployment  
✅ **VS Code integration** with debugging, tasks, and extensions  
✅ **Production-ready** configuration with optimization and security  
✅ **Team collaboration** standards with conventional commits and PR templates  

The setup ensures consistent code quality, reduces bugs through strict typing, and provides a smooth development experience for team collaboration.