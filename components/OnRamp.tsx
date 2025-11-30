'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getNatoTokenContract, swapUsdcToNato } from '@/lib/web3.js';
import { ethers, BrowserProvider } from 'ethers';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import natoTokenAbi from '@/lib/abi/NatoToken.json';

const OnRamp = () => {
  const { user } = usePrivy();
  const [natoBalance, setNatoBalance] = useState('0');
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [isSwapping, setIsSwapping] = useState(false);

  const fetchBalances = async () => {
    if (user?.wallet) {
      try {
        const provider = await user.wallet.getEthereumProvider();
        const ethersProvider = new BrowserProvider(provider);
        const natoContract = getNatoTokenContract(ethersProvider);
        const natoBalance = await natoContract.balanceOf(user.wallet.address);
        setNatoBalance(ethers.formatUnits(natoBalance, 18));

        const usdcAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913';
        const usdcContract = new ethers.Contract(usdcAddress, natoTokenAbi, ethersProvider);
        const usdcBalance = await usdcContract.balanceOf(user.wallet.address);
        setUsdcBalance(ethers.formatUnits(usdcBalance, 6));
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [user]);

  const handleOnRamp = () => {
    const apiKey = process.env.NEXT_PUBLIC_RAMP_API_KEY;
    if (user?.wallet && apiKey) {
      new RampInstantSDK({
        hostAppName: 'Nation.fun',
        hostLogoUrl: 'https://nation.fun/logo.svg',
        swapAsset: 'BASE_USDC',
        userAddress: user.wallet.address,
        hostApiKey: apiKey,
      }).on('*', (event) => {
        if (event.type === 'PURCHASE_SUCCESSFUL') {
          fetchBalances();
        }
      }).show();
    } else {
      console.error("Ramp API key or user wallet not available.");
    }
  };

  const handleSwap = async () => {
    if (user?.wallet) {
      setIsSwapping(true);
      try {
        const provider = await user.wallet.getEthereumProvider();
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const usdcAmount = ethers.parseUnits(usdcBalance, 6);
        await swapUsdcToNato(signer, usdcAmount);
        fetchBalances();
      } catch (error) {
        console.error('Swap failed:', error);
      } finally {
        setIsSwapping(false);
      }
    }
  };

  return (
    <div>
      <h3>Comprar NATO</h3>
      <p>Seu saldo de USDC: {usdcBalance}</p>
      <p>Seu saldo de NATO: {natoBalance}</p>
      <button onClick={handleOnRamp}>Comprar USDC com Pix</button>
      <button onClick={handleSwap} disabled={isSwapping || parseFloat(usdcBalance) === 0}>
        {isSwapping ? 'Trocando...' : 'Trocar USDC para NATO'}
      </button>
    </div>
  );
};

export default OnRamp;
