// hardhat/scripts/deploy-mocks.js
const hre = require("hardhat");

async function main() {
  // --- Setup ---
  const [deployer] = await hre.ethers.getSigners();
  // Cria uma carteira de teste aleatória para receber os ativos
  const testUser = hre.ethers.Wallet.createRandom();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Setting up test assets for account:", testUser.address);

  // Envia 1 ETH do deployer para a nova carteira de teste para cobrir taxas de gás futuras
  await deployer.sendTransaction({
    to: testUser.address,
    value: hre.ethers.parseEther("1.0"),
  });
  console.log(`Sent 1 ETH to new test user ${testUser.address}`);

  // --- Deploy NatoCoin ---
  const NatoCoin = await hre.ethers.getContractFactory("NatoCoin");
  const natoCoin = await NatoCoin.deploy();
  await natoCoin.waitForDeployment();
  const natoCoinAddress = await natoCoin.getAddress();
  console.log("NatoCoin deployed to:", natoCoinAddress);

  // --- Deploy GovindasCoin ---
  const GovindasCoin = await hre.ethers.getContractFactory("GovindasCoin");
  const govindasCoin = await GovindasCoin.deploy();
  await govindasCoin.waitForDeployment();
  const govindasCoinAddress = await govindasCoin.getAddress();
  console.log("GovindasCoin deployed to:", govindasCoinAddress);

  // --- Deploy MockERC721 ---
  const MockNFT = await hre.ethers.getContractFactory("MockERC721");
  const mockNFT = await MockNFT.deploy();
  await mockNFT.waitForDeployment();
  const mockNFTAddress = await mockNFT.getAddress();
  console.log("MockERC721 (NFT) deployed to:", mockNFTAddress);

  // --- Asset Distribution ---
  console.log("\n--- Distributing assets to test user ---");

  // Enviar 100 NATO para o usuário de teste
  const natoAmount = hre.ethers.parseUnits("100", 18);
  await natoCoin.connect(deployer).transfer(testUser.address, natoAmount);
  console.log(`Sent 100 NATO to ${testUser.address}`);

  // Enviar 500 GVC para o usuário de teste
  const goviAmount = hre.ethers.parseUnits("500", 18);
  await govindasCoin.connect(deployer).transfer(testUser.address, goviAmount);
  console.log(`Sent 500 GVC to ${testUser.address}`);

  // Mintar 2 NFTs para o usuário de teste
  await mockNFT.connect(deployer).safeMint(testUser.address, 1);
  console.log(`Minted NFT with ID 1 to ${testUser.address}`);
  await mockNFT.connect(deployer).safeMint(testUser.address, 2);
  console.log(`Minted NFT with ID 2 to ${testUser.address}`);

  // --- Final Instructions ---
  console.log("\n--- Deployment and setup complete! ---");
  console.log("This is the private key for the test user, you can import it into MetaMask:");
  console.log(testUser.privateKey);
  console.log("\nPlease copy the following lines into your .env.local file:");
  console.log("--------------------------------------------------");
  console.log(`NEXT_PUBLIC_NATO_TOKEN_ADDRESS=${natoCoinAddress}`);
  console.log(`NEXT_PUBLIC_GOVI_COIN_ADDRESS=${govindasCoinAddress}`);
  console.log(`NEXT_PUBLIC_NFT_COLLECTION_ADDRESS=${mockNFTAddress}`);
  console.log("--------------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
