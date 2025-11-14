const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hardhat Forking Environment", function () {
  it("Should have a signer with a balance", async function () {
    const [signer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(signer.address);
    console.log(`Signer address: ${signer.address}`);
    console.log(`Signer balance: ${ethers.formatEther(balance)} ETH`);
    expect(balance).to.be.gt(0);
  });

  it("Should be forked from the correct block number", async function () {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`Current block number: ${blockNumber}`);
    // O número do bloco será maior ou igual ao especificado no config,
    // pois a rede local continua a minerar blocos.
    expect(blockNumber).to.be.gte(15000000);
  });
});
