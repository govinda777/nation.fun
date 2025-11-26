import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NATION_PASS_CONTRACT_ADDRESS;
const erc721Abi = ["function balanceOf(address owner) view returns (uint256)"];

const BuyNftStep = ({ onComplete }) => {
  const { user } = usePrivy();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (user?.wallet) {
      const ethersProvider = new ethers.BrowserProvider(user.wallet.provider);
      setProvider(ethersProvider);
    }
  }, [user]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/opensea/get-nft-listing');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch NFT listing.');
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, []);

  const verifyNftOwnership = async () => {
    if (!user?.wallet || !provider || !NFT_CONTRACT_ADDRESS) return false;
    try {
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, erc721Abi, provider);
      const balance = await nftContract.balanceOf(user.wallet.address);
      return balance > 0n;
    } catch (error) {
      console.error("Error verifying NFT ownership:", error);
      return false;
    }
  };

  const handlePurchase = async () => {
    if (!listing || !user?.wallet) return;

    setIsPurchasing(true);
    try {
      // 1. Call our backend to get the transaction parameters
      const response = await fetch('/api/opensea/fulfill-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: listing,
          fulfillerAddress: user.wallet.address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to prepare transaction.');
      }

      const { transactionParameters } = await response.json();

      // 2. Get the signer from the user's wallet and send the transaction
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction(transactionParameters);
      const receipt = await tx.wait(); // Wait for the transaction to be mined

      console.log('Purchase transaction successful:', receipt.hash);

      // 3. Verify NFT ownership
      const hasNft = await verifyNftOwnership();
      if (hasNft) {
        onComplete();
      } else {
        alert("Transaction confirmed, but we couldn't find the NFT in your wallet yet. It might take a moment to appear.");
      }

    } catch (err) {
      console.error("Purchase failed:", err);
      alert(`Purchase failed: ${err.message}`);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) return <p>Carregando informações do NFT...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
  if (!listing) return <p>Não foi possível encontrar o Nation Pass NFT para venda.</p>;

  const price = ethers.formatEther(listing.price.current.value);

  return (
    <div className="nft-purchase-container">
      <h2>Passo 3: Comprar o Nation Pass NFT</h2>
      <p>O NFT lhe dá acesso para criar e gerenciar agentes.</p>
      <div className="nft-details">
        <img src={listing.nft.image_url} alt={listing.nft.name} style={{ width: '200px', borderRadius: '8px' }} />
        <h3>{listing.nft.name}</h3>
        <p>{listing.nft.description}</p>
        <p className="price"><strong>Preço:</strong> {price} ETH</p>
      </div>
      <button onClick={handlePurchase} disabled={isPurchasing || !user?.wallet}>
        {isPurchasing ? 'Processando...' : 'Comprar Agora'}
      </button>
      {!user?.wallet && <p style={{marginTop: '10px'}}>Por favor, conecte sua carteira para comprar.</p>}
    </div>
  );
};

export default BuyNftStep;
