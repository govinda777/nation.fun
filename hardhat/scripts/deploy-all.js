const hre = require("hardhat");
const EntryPointArtifact = require("@account-abstraction/contracts/artifacts/EntryPoint.json");

async function main() {
  // Deploy EntryPoint
  const [owner] = await hre.ethers.getSigners();
  const EntryPointFactory = new hre.ethers.ContractFactory(EntryPointArtifact.abi, EntryPointArtifact.bytecode, owner);
  const entryPoint = await EntryPointFactory.deploy();
  await entryPoint.waitForDeployment();
  const entryPointAddress = await entryPoint.getAddress();
  console.log("EntryPoint deployed to:", entryPointAddress);

  // Deploy GovindasCoin
  const GovindasCoin = await hre.ethers.getContractFactory("GovindasCoin");
  const govindasCoin = await GovindasCoin.deploy();
  await govindasCoin.waitForDeployment();
  const govindasCoinAddress = await govindasCoin.getAddress();
  console.log("GovindasCoin deployed to:", govindasCoinAddress);

  // Deploy CashbackPaymaster
  const CashbackPaymaster = await hre.ethers.getContractFactory("CashbackPaymaster");
  const paymaster = await CashbackPaymaster.deploy(govindasCoinAddress, entryPointAddress);
  await paymaster.waitForDeployment();
  const paymasterAddress = await paymaster.getAddress();
  console.log("CashbackPaymaster deployed to:", paymasterAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
