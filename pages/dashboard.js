import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import DashboardLayout from '../components/DashboardLayout';
import Head from 'next/head';
import { getUserAssets } from '../services/web3.js';

// --- Sub-componentes de Renderização ---

const WalletInfo = ({ wallet }) => (
  <div className="widget-container">
    <h3>Sua Carteira</h3>
    <p className="wallet-address-full">{wallet.address}</p>
  </div>
);

const AssetBalances = ({ eth, tokens }) => (
  <div className="widget-container">
    <h3>Saldos</h3>
    <div className="balance-item">
      <span>ETH:</span>
      <span>{parseFloat(eth).toFixed(5)}</span>
    </div>
    {tokens.map((token) => (
      <div className="balance-item" key={token.symbol}>
        <span>{token.symbol}:</span>
        <span>{parseFloat(token.balance).toFixed(2)}</span>
      </div>
    ))}
  </div>
);

const NftGallery = ({ nfts }) => (
  <div className="widget-container">
    <h3>Seus NFTs</h3>
    {nfts.length > 0 ? (
      <div className="nft-gallery">
        {nfts.map((nft) => (
          <div className="nft-item" key={nft.id}>
            <img src={nft.image} alt={nft.name} />
            <p>{nft.name}</p>
          </div>
        ))}
      </div>
    ) : (
      <p>Nenhum NFT encontrado.</p>
    )}
  </div>
);

const TransactionHistory = ({ transactions }) => (
  <div className="widget-container">
    <h3>Transações Recentes</h3>
    {transactions.length > 0 ? (
      <ul className="transaction-list">
        {transactions.map((tx) => (
          <li key={tx.hash}>
            <span>{tx.description}</span>
            <span className={tx.value.startsWith('-') ? 'value-negative' : 'value-positive'}>
              {tx.value}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p>Nenhuma transação recente.</p>
    )}
  </div>
);


// --- Componente Principal do Dashboard ---

export default function Dashboard() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const signer = await provider.getSigner();

        const userAssets = await getUserAssets(signer);
        setAssets(userAssets);
      } catch (e) {
        console.error("Erro ao buscar ativos:", e);
        setError("Não foi possível carregar os ativos da carteira.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [wallet]);

  if (!ready || (ready && !authenticated)) {
    return <div className="loading-container">Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>Dashboard - Nation.fun</title>
      </Head>
      <DashboardLayout>
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <p>Bem-vindo de volta!</p>
        </div>

        {loading && <p>Buscando seus ativos na blockchain...</p>}
        {error && <p className="error-message">{error}</p>}

        {assets && (
          <div className="assets-grid">
            <div className="main-column">
              <AssetBalances eth={assets.eth} tokens={assets.tokens} />
              <TransactionHistory transactions={assets.transactions} />
            </div>
            <div className="side-column">
              <WalletInfo wallet={wallet} />
              <NftGallery nfts={assets.nfts} />
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
