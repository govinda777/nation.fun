import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

const OPENSEA_URL = process.env.NEXT_PUBLIC_OPENSEA_COLLECTION_URL || "https://opensea.io/collection/your-collection-name";
const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NATION_PASS_CONTRACT_ADDRESS;

const erc721Abi = ["function balanceOf(address owner) view returns (uint256)"];

const BuyNftStep = ({ onComplete }) => {
  const { user } = usePrivy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provider, setProvider] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (user?.wallet) {
      const ethersProvider = new ethers.BrowserProvider(user.wallet.provider);
      setProvider(ethersProvider);
    }
  }, [user]);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModalAndVerify = async () => {
    setIsModalOpen(false);
    if (!user?.wallet || !provider || !NFT_CONTRACT_ADDRESS) {
      alert("Não foi possível verificar a posse do NFT. Por favor, recarregue a página e tente novamente.");
      return;
    }
    setIsVerifying(true);
    try {
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, erc721Abi, provider);
      const balance = await nftContract.balanceOf(user.wallet.address);
      if (balance > 0n) {
        onComplete();
      } else {
        alert("Não encontramos o Nation Pass NFT na sua carteira. Por favor, tente a compra novamente ou aguarde alguns instantes para a transação ser confirmada na rede.");
      }
    } catch (error) {
      console.error("Erro ao verificar a posse do NFT:", error);
      alert("Ocorreu um erro ao verificar a posse do NFT. Por favor, verifique o console para mais detalhes.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <h2>Passo 3: Comprar o Nation Pass NFT</h2>
      <p>O NFT lhe dá acesso para criar e gerenciar agentes. Clique abaixo para comprar na OpenSea.</p>

      <button onClick={handleOpenModal} disabled={isVerifying || !provider}>
        Comprar NFT
      </button>

      {isVerifying && <p>Verificando sua compra na blockchain...</p>}

      {isModalOpen && (
        <div className="onramp-modal">
          <div className="onramp-modal-container">
            <button className="onramp-modal-close-button" onClick={handleCloseModalAndVerify}>
              &times; Fechar e Verificar Compra
            </button>
            <iframe
              src={OPENSEA_URL}
              className="onramp-modal-iframe"
              title="OpenSea NFT Purchase"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyNftStep;
