const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node']
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.(test|spec).{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.(test|spec).{js,jsx,ts,tsx}',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/app/**/*.{js,jsx,ts,tsx}', // Exclude Next.js app directory
    '!src/types/**/*',
    '!src/constants/**/*',
    '!src/**/index.ts', // Barrel exports
  ],
  coverageReporters: ['text', 'lcov', 'html', 'json', 'json-summary'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/components/business/*.tsx': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    'src/components/layout/*.tsx': {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(.*\\.mjs$|msw))',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  testTimeout: 10000, // 增加测试超时时间
  maxWorkers: '50%', // 限制并发worker数量
  collectCoverage: false, // 默认不收集覆盖率，在特定脚本中启用
  verbose: true,
  bail: false, // 不要在第一个测试失败时停止
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)