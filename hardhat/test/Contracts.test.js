const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Nation.fun Contracts", function () {
  let deployer, user;
  let natoToken, nationPass;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();

    // Deploy NatoToken
    const NatoToken = await ethers.getContractFactory("NatoToken");
    natoToken = await NatoToken.deploy(ethers.parseUnits("1000000", 18));
    await natoToken.waitForDeployment();

    // Deploy NationPass
    const NationPass = await ethers.getContractFactory("NationPass");
    nationPass = await NationPass.deploy();
    await nationPass.waitForDeployment();
  });

  describe("NatoToken", function () {
    it("Should have minted the initial supply to the deployer", async function () {
      const deployerBalance = await natoToken.balanceOf(deployer.address);
      expect(deployerBalance).to.equal(ethers.parseUnits("1000000", 18));
    });

    it("Should allow transfers between accounts", async function () {
      await natoToken.transfer(user.address, ethers.parseUnits("100", 18));
      const userBalance = await natoToken.balanceOf(user.address);
      expect(userBalance).to.equal(ethers.parseUnits("100", 18));
    });
  });

  describe("NationPass", function () {
    it("Should mint a new NFT to the specified address", async function () {
      await nationPass.publicMint(user.address);
      const ownerOfToken = await nationPass.ownerOf(0);
      expect(ownerOfToken).to.equal(user.address);
    });

    it("Should allow any user to mint", async function () {
      await expect(
        nationPass.connect(user).publicMint(user.address)
      ).to.not.be.reverted;
      const ownerOfToken = await nationPass.ownerOf(0);
      expect(ownerOfToken).to.equal(user.address);
    });

    it("Should have the correct total supply", async function () {
      expect(await nationPass.totalSupply()).to.equal(0);
      await nationPass.publicMint(user.address);
      expect(await nationPass.totalSupply()).to.equal(1);
    });
  });
});
