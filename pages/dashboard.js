import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Head from 'next/head';

export default function Dashboard() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return <div className="loading-container">Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>Dashboard - Nation.fun</title>
      </Head>
      <DashboardLayout>
        <h2>Dashboard</h2>
        <p>Bem-vindo de volta!</p>
        {wallet && (
          <div className="wallet-info">
            <h3>Sua Carteira</h3>
            <p className="wallet-address-full">
              {wallet.address}
            </p>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
