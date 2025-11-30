'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getProvider, getNatoTokenContract, swapUsdcToNato } from '@/lib/web3.js';
import { ethers } from 'ethers';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import natoTokenAbi from '@/lib/abi/NatoToken.json'; // Importando o ABI

const OnRamp = () => {
  const { user } = usePrivy();
  const [natoBalance, setNatoBalance] = useState('0');
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [isSwapping, setIsSwapping] = useState(false);

  const fetchBalances = async () => {
    if (user && user.wallet) {
      const provider = getProvider();
      const natoContract = getNatoTokenContract(provider);
      const natoBalance = await natoContract.balanceOf(user.wallet.address);
      setNatoBalance(ethers.formatUnits(natoBalance, 18));

      const usdcAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913';
      const usdcContract = new ethers.Contract(usdcAddress, natoTokenAbi, provider);
      const usdcBalance = await usdcContract.balanceOf(user.wallet.address);
      setUsdcBalance(ethers.formatUnits(usdcBalance, 6)); // USDC has 6 decimals
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [user]);

  const handleOnRamp = () => {
    if (user && user.wallet) {
      new RampInstantSDK({
        hostAppName: 'Nation.fun',
        hostLogoUrl: 'https://nation.fun/logo.svg', // Replace with your actual logo URL
        swapAsset: 'BASE_USDC',
        userAddress: user.wallet.address,
        hostApiKey: process.env.NEXT_PUBLIC_RAMP_API_KEY,
      }).on('*', (event) => {
        if (event.type === 'PURCHASE_SUCCESSFUL') {
          fetchBalances();
        }
      }).show();
    }
  };

  const handleSwap = async () => {
    if (user && user.wallet) {
      setIsSwapping(true);
      try {
        const provider = getProvider();
        const signer = await provider.getSigner(); // Ethers v6 requires await
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
