const hre = require("hardhat");

async function main() {
  const GovindasCoin = await hre.ethers.getContractFactory("GovindasCoin");
  const govindasCoin = await GovindasCoin.deploy();

  await govindasCoin.waitForDeployment();

  const govindasCoinAddress = await govindasCoin.getAddress();

  console.log("GovindasCoin deployed to:", govindasCoinAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
