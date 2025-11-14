require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

const BASE_MAINNET_RPC_URL = process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org";

// Only include accounts if a private key is provided
const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
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
