const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { ethers } = require('ethers');
const { getNationPassContract, getTestSigner } = require('../../services/web3.js');

let testSigner;
let nationPassContract;
let initialBalance;
let finalBalance;

Given('um usuário com saldo zero de Nation Pass', async function () {
  // Set up the test environment to use the Hardhat node
  process.env.NEXT_PUBLIC_IS_TESTING = 'true';
  testSigner = await getTestSigner();
  nationPassContract = getNationPassContract(testSigner);

  // Check initial balance, it should be 0
  initialBalance = await nationPassContract.balanceOf(testSigner.address);
  expect(initialBalance).toBe(0n);
});

When('o usuário compra um Nation Pass', async function () {
  // Simulate the minting process
  const tx = await nationPassContract.publicMint(testSigner.address);
  await tx.wait();
});

Then('o saldo de Nation Pass do usuário deve ser um', async function () {
  // Check the final balance
  finalBalance = await nationPassContract.balanceOf(testSigner.address);
  expect(finalBalance).toBe(1n);

  // Clean up the environment variable
  delete process.env.NEXT_PUBLIC_IS_TESTING;
});
