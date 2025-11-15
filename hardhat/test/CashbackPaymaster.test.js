const { expect } = require("chai");
const { ethers } = require("hardhat");
const EntryPointArtifact = require("@account-abstraction/contracts/artifacts/EntryPoint.json");

describe("CashbackPaymaster", function () {
    let entryPoint, owner, user, govindasCoin, paymaster;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        // Manually deploy EntryPoint from artifacts
        const EntryPointFactory = new ethers.ContractFactory(EntryPointArtifact.abi, EntryPointArtifact.bytecode, owner);
        entryPoint = await EntryPointFactory.deploy();

        const GovindasCoin = await ethers.getContractFactory("GovindasCoin");
        govindasCoin = await GovindasCoin.deploy();
        const gvcAddress = await govindasCoin.getAddress();

        const CashbackPaymaster = await ethers.getContractFactory("CashbackPaymaster");
        const entryPointAddress = await entryPoint.getAddress();
        paymaster = await CashbackPaymaster.deploy(gvcAddress, entryPointAddress);
        const paymasterAddress = await paymaster.getAddress();

        // Fund the paymaster with 100 GVC for cashback distributions
        await govindasCoin.transfer(paymasterAddress, ethers.parseUnits("100", 18));
    });

    it("should correctly pass user address via context and send cashback", async () => {
        const userOp = {
            sender: user.address,
            // ... other userOp fields can be dummy for this test
        };

        // This is a direct contract call, not via the EntryPoint, so we need to impersonate the EP
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [await entryPoint.getAddress()],
        });
        const entryPointSigner = await ethers.getSigner(await entryPoint.getAddress());

        // Fund the EntryPoint signer so it can pay for gas
        await owner.sendTransaction({
            to: entryPointSigner.address,
            value: ethers.parseEther("1.0")
        });

        // 1. Simulate validatePaymasterUserOp to get the context
        // We can't directly call it as it's restricted to the EntryPoint, so we can't easily get the return value.
        // Instead, we will construct the context manually, as we know the implementation.
        const context = ethers.AbiCoder.defaultAbiCoder().encode(['address'], [user.address]);

        // 2. Call postOp from the EntryPoint's perspective
        const userInitialBalance = await govindasCoin.balanceOf(user.address);
        expect(userInitialBalance).to.equal(0);

        await paymaster.connect(entryPointSigner).postOp(0, context, 0, 0);

        // 3. Verify the user received the cashback
        const userFinalBalance = await govindasCoin.balanceOf(user.address);
        expect(userFinalBalance).to.equal(ethers.parseUnits("1", 18)); // 1 GVC
    });

    it("should allow the owner to withdraw ETH", async () => {
        const ownerInitialBalance = await ethers.provider.getBalance(owner.address);

        await owner.sendTransaction({
            to: await paymaster.getAddress(),
            value: ethers.parseEther("1.0"),
        });

        const paymasterBalance = await ethers.provider.getBalance(await paymaster.getAddress());
        expect(paymasterBalance).to.equal(ethers.parseEther("1.0"));

        await paymaster.connect(owner).withdrawEth(owner.address, paymasterBalance);

        const paymasterFinalBalance = await ethers.provider.getBalance(await paymaster.getAddress());
        expect(paymasterFinalBalance).to.equal(0);
    });
});
