import { useWallets } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';

function WalletAssets() {
  const { wallets } = useWallets();
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);
      try {
        const allBalances = [];
        for (const wallet of wallets) {
          const balance = await wallet.balance();
          allBalances.push({ address: wallet.address, ...balance });
        }
        setBalances(allBalances);
      } catch (error) {
        console.error("Failed to fetch wallet balances:", error);
      }
      setLoading(false);
    };

    if (wallets && wallets.length > 0) {
      fetchBalances();
    } else {
      setLoading(false);
    }
  }, [wallets]);

  if (loading) {
    return <div>Carregando seus ativos...</div>;
  }

  return (
    <div className="wallet-assets">
      <h3>Sua Carteira</h3>
      {wallets && wallets.length > 0 ? (
        wallets.map((wallet, index) => (
          <div key={wallet.address} className="wallet-info">
            <p><strong>Endereço:</strong> {wallet.address}</p>
            {balances[index] ? (
              <p><strong>Saldo:</strong> {balances[index].value.toString()} {balances[index].symbol}</p>
            ) : (
              <p>Carregando saldo...</p>
            )}
          </div>
        ))
      ) : (
        <p>Nenhuma carteira conectada.</p>
      )}
    </div>
  );
}

export default WalletAssets;
