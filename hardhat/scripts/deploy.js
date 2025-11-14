// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Get the signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy NatoToken
  const NatoToken = await ethers.getContractFactory("NatoToken");
  // Deploy with an initial supply of 1,000,000 tokens (adjust as needed)
  const natoToken = await NatoToken.deploy(ethers.parseUnits("1000000", 18));
  await natoToken.waitForDeployment();
  console.log("NatoToken deployed to:", await natoToken.getAddress());

  // Deploy NationPass
  const NationPass = await ethers.getContractFactory("NationPass");
  const nationPass = await NationPass.deploy();
  await nationPass.waitForDeployment();
  console.log("NationPass deployed to:", await nationPass.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
