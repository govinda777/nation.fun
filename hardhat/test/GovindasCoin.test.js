const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GovindasCoin", function () {
  let govindasCoin;
  let owner;

  beforeEach(async function () {
    const GovindasCoin = await ethers.getContractFactory("GovindasCoin");
    [owner] = await ethers.getSigners();
    govindasCoin = await GovindasCoin.deploy();
  });

  it("Should have the correct name, symbol, and supply", async function () {
    expect(await govindasCoin.name()).to.equal("Govindas Coin");
    expect(await govindasCoin.symbol()).to.equal("GVC");
    const expectedSupply = ethers.parseUnits("1000000", 18);
    expect(await govindasCoin.totalSupply()).to.equal(expectedSupply);
  });

  it("Should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await govindasCoin.balanceOf(owner.address);
    expect(await govindasCoin.totalSupply()).to.equal(ownerBalance);
  });
});
