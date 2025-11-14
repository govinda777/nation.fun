const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Ownership Verification", function () {
  let mockNft;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const MockERC721 = await ethers.getContractFactory("MockERC721");
    mockNft = await MockERC721.deploy();
  });

  it("Should correctly report the balance of an NFT owner", async function () {
    // Mint um NFT para o addr1
    await mockNft.safeMint(addr1.address, 1);

    // Verifica o balanço
    const balance = await mockNft.balanceOf(addr1.address);
    expect(balance).to.equal(1);
  });

  it("Should correctly report a balance of zero for a non-owner", async function () {
    // Mint um NFT para o owner
    await mockNft.safeMint(owner.address, 1);

    // Verifica o balanço do addr1, que não possui o NFT
    const balance = await mockNft.balanceOf(addr1.address);
    expect(balance).to.equal(0);
  });

  it("Our component logic `balance > 0n` should work", async function () {
    // Mint um NFT para o addr1
    await mockNft.safeMint(addr1.address, 1);

    const balance = await mockNft.balanceOf(addr1.address);
    const balanceAsBigInt = BigInt(balance.toString());

    // Simula a lógica do componente
    const hasNft = balanceAsBigInt > 0n;
    expect(hasNft).to.be.true;

    const balance2 = await mockNft.balanceOf(owner.address);
    const balance2AsBigInt = BigInt(balance2.toString());
    const hasNft2 = balance2AsBigInt > 0n;
    expect(hasNft2).to.be.false;
  });
});
