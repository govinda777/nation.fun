import React from 'react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { usePrivy } from '@privy-io/react-auth';

const HOST_LOGO_URL = 'https://nation.fun/logo.svg';

const BuyEthStep = ({ onComplete }) => {
  const { user } = usePrivy();

  const openRampWidget = () => {
    if (!user?.wallet?.address) return;
    new RampInstantSDK({
      hostAppName: 'Nation.fun',
      hostLogoUrl: HOST_LOGO_URL,
      hostApiKey: process.env.NEXT_PUBLIC_RAMP_API_KEY,
      swapAsset: 'BASE_ETH',
      userAddress: user.wallet.address,
    }).on('*', (event) => {
      if (event.type === 'WIDGET_CLOSE') onComplete();
    }).show();
  };

  return (
    <div>
      <h2>Passo 1: Comprar ETH</h2>
      <p>Você precisa de ETH na rede Base para pagar as taxas de transação e comprar o NFT.</p>
      <button onClick={openRampWidget} disabled={!user?.wallet?.address}>
        Comprar ETH com Pix (via Ramp)
      </button>
      {!user?.wallet?.address && <p>Conectando à sua carteira...</p>}
    </div>
  );
};

export default BuyEthStep;
