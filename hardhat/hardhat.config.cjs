require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

const BASE_MAINNET_RPC_URL = process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org";

// Only include accounts if a private key is provided
const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      gasPrice: 20000000000, // 20 Gwei
      gas: 6000000,
    },
    hardhat: {
      forking: {
        url: BASE_MAINNET_RPC_URL,
        blockNumber: 15000000 // Usando um bloco recente para o fork
      }
    },
    base: {
      url: BASE_MAINNET_RPC_URL,
      accounts: accounts,
      chainId: 8453
    }
  }
};
