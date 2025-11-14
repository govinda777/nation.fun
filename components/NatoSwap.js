import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { getUniswapRouterContract, getNatoTokenContract } from '../services/web3';

// On a real network, this would come from a trusted source. For localhost, it's deployed by our script.
const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS;

const NatoSwap = () => {
  const { authenticated } = usePrivy() || {};
  const { wallets } = useWallets() || {};
  const [ethAmount, setEthAmount] = useState('');
  const [natoBalance, setNatoBalance] = useState('0');
  const [isSwapping, setIsSwapping] = useState(false);

  const embeddedWallet = wallets?.find(wallet => wallet.walletClientType === 'privy');

  const fetchNatoBalance = async () => {
    if (authenticated && embeddedWallet) {
      const provider = await embeddedWallet.getEthersProvider();
      const contract = getNatoTokenContract(provider);
      const balance = await contract.balanceOf(embeddedWallet.address);
      setNatoBalance(ethers.formatUnits(balance, 18));
    }
  };

  useEffect(() => {
    fetchNatoBalance();
  }, [authenticated, wallets]);

  const handleSwap = async () => {
    if (!authenticated || !embeddedWallet) {
      alert('Please connect your wallet first.');
      return;
    }
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      alert('Please enter a valid amount of ETH.');
      return;
    }

    setIsSwapping(true);
    try {
      const provider = await embeddedWallet.getEthersProvider();
      const signer = await provider.getSigner();

      const routerContract = getUniswapRouterContract(signer);
      const natoTokenAddress = await getNatoTokenContract(signer).getAddress();

      const amountIn = ethers.parseEther(ethAmount);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      const tx = await routerContract.swapExactETHForTokens(
        0, // amountOutMin - acceptable slippage, 0 for simplicity in test
        [WETH_ADDRESS, natoTokenAddress],
        await signer.getAddress(),
        deadline,
        { value: amountIn }
      );

      await tx.wait();

      alert('Swap successful!');
      fetchNatoBalance(); // Refresh balance after swap

    } catch (error) {
      console.error('Swap failed:', error);
      alert('Swap failed. Check the console for details.');
    } finally {
      setIsSwapping(false);
    }
  };

  if (!authenticated) {
    return <p>Please log in to swap for NATO tokens.</p>;
  }

  return (
    <div className="swap-container">
      <h3>Swap ETH for NATO</h3>
      <p>Your NATO Balance: {parseFloat(natoBalance).toFixed(4)}</p>
      <div>
        <input
          type="number"
          placeholder="0.0"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
        />
        <span>ETH</span>
      </div>
      <button onClick={handleSwap} disabled={isSwapping}>
        {isSwapping ? 'Swapping...' : 'Swap'}
      </button>
    </div>
  );
};

export default NatoSwap;
