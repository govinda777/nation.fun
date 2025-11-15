const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { ethers } = require('ethers');
const {
  getNatoTokenContract,
  getUsdcContract,
  getTestSigner,
  swapUsdcToNato,
  getProvider
} = require('../../services/web3.js');

let testSigner;
let natoTokenContract;
let usdcContract;
let initialNatoBalance;
let finalNatoBalance;
const usdcAmountToSwap = ethers.parseUnits("100", 6); // 100 USDC

// Helper to set USDC balance for a test account
async function setUsdcBalance(provider, userAddress, amount) {
    const usdcHolder = "0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf"; // A known USDC holder on Base mainnet
    await provider.send("hardhat_impersonateAccount", [usdcHolder]);
    const usdcSigner = await provider.getSigner(usdcHolder);
    const localUsdcContract = getUsdcContract(usdcSigner);
    await localUsdcContract.transfer(userAddress, amount);
    await provider.send("hardhat_stopImpersonatingAccount", [usdcHolder]);
}

Given('um usuário com saldo de USDC e saldo zero de NATO', async function () {
    process.env.NEXT_PUBLIC_IS_TESTING = 'true';
    testSigner = await getTestSigner();
    natoTokenContract = getNatoTokenContract(testSigner);
    usdcContract = getUsdcContract(testSigner);
    const provider = getProvider();

    // Set a starting USDC balance for the test signer
    await setUsdcBalance(provider, testSigner.address, usdcAmountToSwap);
    const initialUsdcBalance = await usdcContract.balanceOf(testSigner.address);
    expect(initialUsdcBalance).toBe(usdcAmountToSwap);

    // Verify initial NATO balance is zero
    initialNatoBalance = await natoTokenContract.balanceOf(testSigner.address);
    expect(initialNatoBalance).toBe(0n);
});

When('o usuário troca USDC por NATO', async function () {
    // The component would call this function
    await swapUsdcToNato(testSigner, usdcAmountToSwap);
});

Then('o saldo de NATO do usuário deve ser maior que zero', async function () {
    finalNatoBalance = await natoTokenContract.balanceOf(testSigner.address);
    const finalUsdcBalance = await usdcContract.balanceOf(testSigner.address);

    // The user should have spent their USDC
    expect(finalUsdcBalance).toBe(0n);
    // The user should have received some NATO tokens
    expect(finalNatoBalance).toBeGreaterThan(0n);

    delete process.env.NEXT_PUBLIC_IS_TESTING;
});
