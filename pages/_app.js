import '../styles/style.css';
import '../styles/WalletAssets.css';
import { PrivyProvider } from '@privy-io/react-auth';

function MyApp({ Component, pageProps }) {
  const isTest = process.env.NODE_ENV === 'test';

  return (
    <>
      {isTest ? (
        <Component {...pageProps} />
      ) : (
        <PrivyProvider
          appId="cmhvac4m3009hl60crkjhlrql"
          config={{
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
            },
          }}
        >
          <Component {...pageProps} />
        </PrivyProvider>
      )}
    </>
  );
}

export default MyApp;
