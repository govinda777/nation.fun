// jest.config.cjs

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Procura por arquivos de teste nos diretórios __tests__ e features
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/features/**/*.steps.ts'
  ],
  // Ignora o diretório do hardhat, que tem sua própria configuração de teste
  testPathIgnorePatterns: [
    '/node_modules/',
    '/hardhat/',
  ],
  // Mapeia os aliases de caminho definidos no tsconfig.json para que o Jest os entenda
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Aumenta o timeout padrão para testes que podem ser mais lentos
  testTimeout: 30000,
};
