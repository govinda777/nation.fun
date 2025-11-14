const { ethers } = require("hardhat");
const fs = require('fs');

const factoryArtifact = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying all contracts with the account:", deployer.address);

  // Deploy WETH9
  const WETH9 = await ethers.getContractFactory("WETH9");
  const weth = await WETH9.deploy();
  await weth.waitForDeployment();
  console.log("WETH9 deployed to:", await weth.getAddress());

  // Deploy NatoToken
  const NatoToken = await ethers.getContractFactory("NatoToken");
  const natoToken = await NatoToken.deploy(ethers.parseUnits("1000000", 18));
  await natoToken.waitForDeployment();
  console.log("NatoToken deployed to:", await natoToken.getAddress());

  // Deploy NationPass
  const NationPass = await ethers.getContractFactory("NationPass");
  const nationPass = await NationPass.deploy();
  await nationPass.waitForDeployment();
  console.log("NationPass deployed to:", await nationPass.getAddress());

  // Deploy Uniswap V2 Factory
  const UniswapFactory = new ethers.ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, deployer);
  const factory = await UniswapFactory.deploy(deployer.address);
  await factory.waitForDeployment();
  console.log("UniswapV2Factory deployed to:", await factory.getAddress());

  // Deploy Uniswap V2 Router
  const UniswapRouter = new ethers.ContractFactory(routerArtifact.abi, routerArtifact.bytecode, deployer);
  const router = await UniswapRouter.deploy(await factory.getAddress(), await weth.getAddress());
  await router.waitForDeployment();
  console.log("UniswapV2Router02 deployed to:", await router.getAddress());

  // Create liquidity pool for NATO/WETH
  console.log("Creating liquidity pool...");
  const initialNatoSupply = ethers.parseUnits("100000", 18);
  const initialWethSupply = ethers.parseEther("10");

  await natoToken.approve(await router.getAddress(), initialNatoSupply);
  await weth.deposit({ value: initialWethSupply });
  await weth.approve(await router.getAddress(), initialWethSupply);

  await router.addLiquidity(
    await natoToken.getAddress(),
    await weth.getAddress(),
    initialNatoSupply,
    initialWethSupply,
    0, 0, // min amounts
    deployer.address,
    Math.floor(Date.now() / 1000) + 60 * 10
  );
  console.log("Liquidity pool created.");

  // Save addresses
  const addresses = {
    weth: await weth.getAddress(),
    natoToken: await natoToken.getAddress(),
    nationPass: await nationPass.getAddress(),
    uniswapFactory: await factory.getAddress(),
    uniswapRouter: await router.getAddress()
  };

  fs.writeFileSync("deployed-addresses.json", JSON.stringify(addresses, null, 2));
  console.log("Contract addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
