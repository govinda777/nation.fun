module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    // Handle module aliases (if you have them in your tsconfig.json or jsconfig.json)
    '^@/components/(.*)$': '<rootDir>/components/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  testMatch: [
    '<rootDir>/components/**/__tests__/**/*.js?(x)',
  ],
};
