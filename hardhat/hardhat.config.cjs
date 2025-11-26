require("@nomicfoundation/hardhat-toolbox");
// Use um caminho absoluto para garantir que o .env.local seja sempre encontrado
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.local") });

// Pega a chave privada do deployer do arquivo .env.local
const deployerPrivateKey = process.env.HARDHAT_PRIVATE_KEY_DEPLOYER;

// Adiciona um log para depuração
if (!deployerPrivateKey) {
  console.warn("AVISO: não encontrada no .env.local. Usando contas padrão do Hardhat.");
}

// Garante que a chave privada do deployer esteja disponível para a rede localhost.
const accounts = deployerPrivateKey ? [deployerPrivateKey] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      // Se a chave não for fornecida, o ethers usará as contas padrão do nó
      accounts: accounts,
      chainId: 31337,
    },
  },
};
