import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { getNationPassContract } from '../services/web3';

const NationPassMinter = () => {
  const { authenticated, user } = usePrivy() || {};
  const { wallets } = useWallets() || {};
  const [isMinting, setIsMinting] = useState(false);
  const [balance, setBalance] = useState(0);

  const embeddedWallet = wallets?.find(wallet => wallet.walletClientType === 'privy');

  const fetchBalance = async () => {
    if (authenticated && embeddedWallet) {
      const provider = await embeddedWallet.getEthersProvider();
      const contract = getNationPassContract(provider);
      const userBalance = await contract.balanceOf(embeddedWallet.address);
      setBalance(Number(userBalance));
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [authenticated, wallets]);

  const handleMint = async () => {
    if (!authenticated || !embeddedWallet) {
      alert('Please connect your wallet first.');
      return;
    }

    setIsMinting(true);
    try {
      const provider = await embeddedWallet.getEthersProvider();
      const signer = await provider.getSigner();
      const contract = getNationPassContract(signer);

      // The `safeMint` function in our contract is `onlyOwner`.
      // Call the new publicMint function
      const tx = await contract.publicMint(embeddedWallet.address);
      await tx.wait(); // Wait for the transaction to be mined

      alert('Nation Pass minted successfully!');
      fetchBalance(); // Refresh balance after minting
    } catch (error) {
      console.error('Failed to mint Nation Pass:', error);
      alert('Failed to mint Nation Pass. Check the console for details.');
    } finally {
      setIsMinting(false);
    }
  };

  if (!authenticated) {
    return <p>Please log in to purchase a Nation Pass.</p>;
  }

  return (
    <div className="minter-container">
      <h3>Nation Pass NFT</h3>
      <p>Get your exclusive pass to unlock the full potential of Nation.fun.</p>
      {/* Visual representation of the NFT */}
      <div className="nft-visual">
        <p>Nation Pass</p>
      </div>
      <button onClick={handleMint} disabled={isMinting}>
        {isMinting ? 'Minting...' : 'Buy Nation Pass'}
      </button>
    </div>
  );
};

export default NationPassMinter;
