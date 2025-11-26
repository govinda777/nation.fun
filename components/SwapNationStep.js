import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

// Contract addresses for Base network
const UNISWAP_V2_ROUTER_ADDRESS = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006"; // WETH on Base
const NATION_ADDRESS = process.env.NEXT_PUBLIC_NATION_TOKEN_CONTRACT_ADDRESS;

const uniswapV2RouterAbi = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)"
];

const SwapNationStep = ({ onComplete }) => {
  const { user } = usePrivy();
  const [provider, setProvider] = useState(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [nationBalance, setNationBalance] = useState('0');
  const [swapAmount, setSwapAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    if (user?.wallet) {
      const ethersProvider = new ethers.BrowserProvider(user.wallet.provider);
      setProvider(ethersProvider);
    }
  }, [user]);

  const fetchBalances = async () => {
    if (user?.wallet && provider) {
      const address = user.wallet.address;
      const balance = await provider.getBalance(address);
      setEthBalance(ethers.formatEther(balance));
      if (NATION_ADDRESS) {
        const nationContract = new ethers.Contract(NATION_ADDRESS, ["function balanceOf(address) view returns (uint256)"], provider);
        const nationBal = await nationContract.balanceOf(address);
        setNationBalance(ethers.formatUnits(nationBal, 18));
      }
    }
  };

  useEffect(() => {
    if (provider) fetchBalances();
  }, [provider]);

  const handleSwap = async () => {
    if (!user?.wallet || !provider || !swapAmount || !NATION_ADDRESS) return;
    setIsSwapping(true);

    try {
      const signer = await provider.getSigner();
      const router = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, uniswapV2RouterAbi, signer);

      const amountIn = ethers.parseEther(swapAmount);
      const path = [WETH_ADDRESS, NATION_ADDRESS];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      const tx = await router.swapExactETHForTokens(
        0, // amountOutMin, 0 for no minimum
        path,
        user.wallet.address,
        deadline,
        { value: amountIn }
      );

      await tx.wait();
      await fetchBalances();
      onComplete();

    } catch (error) {
      console.error('Swap failed:', error);
      alert('A troca falhou. Por favor, verifique o console para mais detalhes.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div>
      <h2>Passo 2: Trocar ETH por $NATION</h2>
      <p>Seu saldo de ETH: {parseFloat(ethBalance).toFixed(4)}</p>
      <p>Seu saldo de $NATION: {parseFloat(nationBalance).toFixed(2)}</p>

      <input
        type="number"
        value={swapAmount}
        onChange={(e) => setSwapAmount(e.target.value)}
        placeholder="Quantidade de ETH para trocar"
        disabled={!provider}
      />

      <button onClick={handleSwap} disabled={isSwapping || !swapAmount || !provider}>
        {isSwapping ? 'Trocando...' : 'Trocar'}
      </button>

      <button onClick={onComplete} style={{marginTop: '10px'}}>
        Pular (Já tenho $NATION)
      </button>

      {!provider && <p>Conectando à sua carteira...</p>}
    </div>
  );
};

export default SwapNationStep;
