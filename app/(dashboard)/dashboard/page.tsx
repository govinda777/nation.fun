'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation'; // Importação atualizada
import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import { ethers } from 'ethers';
import DashboardLayout from '@/components/DashboardLayout'; // Alias
import { getUserAssets } from '@/lib/web3.js'; // Alias e caminho atualizado

// --- Metadados da Página ---
// O Next.js recomenda não exportar metadata de componentes cliente.
// Isso deve ser feito em um componente pai (servidor) ou no layout.
// export const metadata: Metadata = {
//   title: 'Dashboard - Nation.fun',
// };

// --- Sub-componentes de Renderização ---
// (Mantidos aqui por simplicidade, poderiam ser movidos para arquivos separados)

const WalletInfo = ({ wallet }: { wallet: any }) => (
  <div className="widget-container">
    <h3>Sua Carteira</h3>
    <p className="wallet-address-full">{wallet.address}</p>
  </div>
);

// ... (outros sub-componentes podem ser migrados de forma similar)

// --- Componente Principal do Dashboard ---

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets && wallets.length > 0 ? wallets[0] : null;

  const [assets, setAssets] = useState<any>(null); // Tipagem básica
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    const fetchAssets = async () => {
      if (!wallet) return;

      setLoading(true);
      setError(null);
      try {
        const provider = await wallet.getEthersProvider();
        // O signer já vem do provider no Ethers v6
        const userAssets = await getUserAssets(provider);
        setAssets(userAssets);
      } catch (e) {
        console.error("Erro ao buscar ativos:", e);
        setError("Não foi possível carregar os ativos da carteira.");
      } finally {
        setLoading(false);
      }
    };

    if (ready && authenticated) {
      fetchAssets();
    }
  }, [wallet, ready, authenticated]);

  if (!ready || (ready && !authenticated)) {
    return <div className="loading-container">Carregando...</div>;
  }

  return (
    <>
      {/* O <Head> é substituído por metadados no layout do grupo */}
      <h2>Dashboard</h2>
      <p>Bem-vindo de volta!</p>

      {loading && <p>Buscando seus ativos na blockchain...</p>}
      {error && <p className="error-message">{error}</p>}

      {wallet && !loading && assets && (
        <div className="dashboard-grid">
          <WalletInfo wallet={wallet} />
          {/* Aqui entrariam os outros widgets como AssetBalances, etc. */}
        </div>
      )}
    </>
  );
}
