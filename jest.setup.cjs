// jest.setup.cjs
require('@testing-library/jest-dom');

// Mock the Privy hooks to prevent errors in the test environment
jest.mock('@privy-io/react-auth', () => ({
  usePrivy: () => ({
    authenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
  useWallets: () => ({
    wallets: [],
  }),
}));
