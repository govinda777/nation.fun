import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { PrivyProvider } from '@privy-io/react-auth';

// Mock do Providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId="test-app-id"
      config={{
        loginMethods: ['wallet'],
        appearance: { theme: 'light' },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
