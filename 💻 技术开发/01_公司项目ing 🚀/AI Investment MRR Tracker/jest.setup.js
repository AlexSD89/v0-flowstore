// Jest DOM testing utilities
import '@testing-library/jest-dom';

// Mock Next.js router
import { jest } from '@jest/globals';

// Global test utilities and mocks
global.console = {
  ...console,
  // Uncomment to ignore specific console outputs in tests
  // warn: jest.fn(),
  // error: jest.fn(),
  // log: jest.fn(),
};

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...props }) => {
    return <a {...props}>{children}</a>;
  },
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  NEXTAUTH_URL: 'http://localhost:3000',
  NEXTAUTH_SECRET: 'test-secret',
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
  REDIS_URL: 'redis://localhost:6379',
  OPENAI_API_KEY: 'test-openai-key',
};

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(),
    company: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    mrrData: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    investmentScore: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    dataSource: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    collectionTask: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
  })),
}));

// Mock Redis
jest.mock('redis', () => ({
  createClient: jest.fn().mockReturnValue({
    connect: jest.fn(),
    disconnect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    flushall: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
  }),
}));

// Mock LangChain
jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockResolvedValue({
      content: 'Mocked AI response',
    }),
  })),
}));

jest.mock('langchain', () => ({
  LLMChain: jest.fn(),
  PromptTemplate: jest.fn(),
}));

// Mock Puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn(),
      evaluate: jest.fn(),
      close: jest.fn(),
      setUserAgent: jest.fn(),
      setViewport: jest.fn(),
      waitForSelector: jest.fn(),
      click: jest.fn(),
      type: jest.fn(),
      screenshot: jest.fn(),
    }),
    close: jest.fn(),
  }),
}));

// Mock Cheerio
jest.mock('cheerio', () => ({
  load: jest.fn().mockReturnValue({
    text: jest.fn().mockReturnValue('Mocked text content'),
    html: jest.fn().mockReturnValue('<div>Mocked HTML</div>'),
    find: jest.fn().mockReturnThis(),
    attr: jest.fn(),
  }),
}));

// Mock Axios
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
  create: jest.fn().mockReturnThis(),
}));

// Mock node-cron
jest.mock('node-cron', () => ({
  schedule: jest.fn(),
  destroy: jest.fn(),
  validate: jest.fn().mockReturnValue(true),
}));

// Setup test database
beforeAll(async () => {
  // Setup code that runs before all tests
  // For example: database migrations, test data setup
});

afterAll(async () => {
  // Cleanup code that runs after all tests
  // For example: database cleanup, close connections
});

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks();
});

// Global test helpers
global.testHelpers = {
  // Mock company data
  createMockCompany: (overrides = {}) => ({
    id: 'test-company-id',
    name: 'Test AI Company',
    description: 'A test AI company for investment tracking',
    website: 'https://test-ai-company.com',
    foundedYear: 2023,
    employeeCount: 15,
    industry: 'AI/ML',
    stage: 'EARLY_STAGE',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }),
  
  // Mock MRR data
  createMockMRRData: (overrides = {}) => ({
    id: 'test-mrr-id',
    companyId: 'test-company-id',
    monthlyRecurringRevenue: 150000,
    month: new Date('2024-01-01'),
    growthRate: 0.15,
    churnRate: 0.05,
    customerCount: 75,
    averageRevenuePerUser: 2000,
    dataSource: 'API',
    confidence: 0.9,
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }),
  
  // Mock investment score
  createMockInvestmentScore: (overrides = {}) => ({
    id: 'test-score-id',
    companyId: 'test-company-id',
    totalScore: 7.5,
    mrrScore: 8.0,
    growthScore: 7.0,
    teamScore: 7.5,
    marketScore: 8.0,
    technologyScore: 7.0,
    competitionScore: 6.5,
    riskScore: 7.5,
    calculatedAt: new Date('2024-01-01'),
    isLatest: true,
    confidence: 0.85,
    notes: 'Test investment score',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }),
  
  // Test utilities
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock API responses
  createMockApiResponse: (data = {}, status = 200) => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  }),
};

// Increase test timeout for integration tests
jest.setTimeout(30000);