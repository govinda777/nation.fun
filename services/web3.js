// services/web3.js
import { ethers } from 'ethers';

// --- ABIs ---
const erc20Abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const erc721Abi = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

// --- Configuração a partir de Variáveis de Ambiente ---
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545';
const natoTokenAddress = process.env.NEXT_PUBLIC_NATO_TOKEN_ADDRESS;
const goviCoinAddress = process.env.NEXT_PUBLIC_GOVI_COIN_ADDRESS;
const nftCollectionAddress = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS;

// Interface para decodificar chamadas de transferência ERC20
const erc20Interface = new ethers.Interface(erc20Abi);

// --- Funções Auxiliares ---

export const getProvider = (signer) => {
  if (signer) return signer.provider;
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(rpcUrl);
};

const getEthBalance = async (provider, address) => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Erro ao buscar saldo de ETH:", error);
    return "0";
  }
};

const getTokenBalance = async (provider, tokenAddress, userAddress) => {
  // ... (mesma implementação de antes)
  if (!tokenAddress) return null;
  try {
    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    const [name, symbol, balance, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.balanceOf(userAddress),
      contract.decimals(),
    ]);
    return { name, symbol, balance: ethers.formatUnits(balance, decimals) };
  } catch (error) {
    console.error(`Erro ao buscar saldo do token ${tokenAddress}:`, error);
    return null;
  }
};

const getOnChainUserNfts = async (provider, userAddress) => {
  // ... (mesma implementação de antes)
  if (!nftCollectionAddress) return [];
  try {
    const contract = new ethers.Contract(nftCollectionAddress, erc721Abi, provider);
    const name = await contract.name();
    const transferFilter = contract.filters.Transfer(null, userAddress);
    const transferEvents = await contract.queryFilter(transferFilter, 0, 'latest');
    const ownedNfts = [];
    for (const event of transferEvents) {
      const tokenId = event.args.tokenId;
      const owner = await contract.ownerOf(tokenId);
      if (owner.toLowerCase() === userAddress.toLowerCase()) {
        ownedNfts.push({
          id: Number(tokenId),
          name: `${name} #${tokenId}`,
          image: `https://via.placeholder.com/150/008080/FFFFFF?text=NFT+${tokenId}`,
        });
      }
    }
    return [...new Map(ownedNfts.map(item => [item.id, item])).values()];
  } catch (error) {
    console.error("Erro ao buscar NFTs on-chain:", error);
    return [];
  }
};

/**
 * Busca as transações recentes de um usuário na blockchain.
 * @param {ethers.Provider} provider - A instância do provedor ethers.
 * @param {string} userAddress - O endereço da carteira do usuário.
 * @returns {Promise<Array<object>>} Uma lista de transações formatadas.
 */
const getOnChainRecentTransactions = async (provider, userAddress) => {
  try {
    const blockNumber = await provider.getBlockNumber();
    const transactions = [];
    const userAddrLower = userAddress.toLowerCase();

    // Escaneia os últimos 50 blocos
    const startBlock = Math.max(0, blockNumber - 50);

    for (let i = blockNumber; i > startBlock; i--) {
      const block = await provider.getBlock(i, true); // true para pré-buscar transações
      if (!block) continue;

      for (const tx of block.prefetchedTransactions) {
        if (transactions.length >= 5) break; // Limita a 5 transações

        const from = tx.from?.toLowerCase();
        const to = tx.to?.toLowerCase();

        if (from === userAddrLower || to === userAddrLower) {
          let description = `Transação Genérica`;
          let value = `${ethers.formatEther(tx.value)} ETH`;
          const direction = from === userAddrLower ? 'Enviou' : 'Recebeu';

          // Checa se é uma transferência de token ERC20
          if (tx.data.startsWith('0xa9059cbb')) { // Seletor da função transfer()
            try {
              const decoded = erc20Interface.parseTransaction({ data: tx.data });
              const tokenAmount = ethers.formatUnits(decoded.args[1], 18); // Assumindo 18 decimais
              description = `${direction} Token`; // Idealmente, buscaríamos o símbolo do token
              value = `${tokenAmount}`;
            } catch (e) { /* ignora se não for decodificável */ }
          } else {
             description = `${direction} ETH`;
          }

          transactions.push({
            hash: tx.hash,
            description: description,
            value: `${from === userAddrLower ? '-' : '+'}${value}`,
          });
        }
      }
      if (transactions.length >= 5) break;
    }
    return transactions;
  } catch (error) {
    console.error("Erro ao buscar transações on-chain:", error);
    return [];
  }
};

// --- Função Principal ---

export const getUserAssets = async (signer) => {
  if (!signer) throw new Error("Signer (carteira) é necessário para buscar os ativos.");

  const provider = getProvider(signer);
  const userAddress = await signer.getAddress();

  const [ethBalance, natoBalance, goviBalance, nfts, transactions] = await Promise.all([
    getEthBalance(provider, userAddress),
    getTokenBalance(provider, natoTokenAddress, userAddress),
    getTokenBalance(provider, goviCoinAddress, userAddress),
    getOnChainUserNfts(provider, userAddress),
    getOnChainRecentTransactions(provider, userAddress),
  ]);

  return {
    eth: ethBalance,
    tokens: [natoBalance, goviBalance].filter(Boolean),
    nfts,
    transactions,
  };
};
