import { Given, When, Then, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { expect } from 'expect-playwright';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ethers } from 'ethers';
import { getNationPassContract } from '../../services/web3.js';

const execAsync = promisify(exec);

let browser;
let page;
let hardhatNode;

// Mock wallet for the test user
const MOCK_WALLET_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Second Hardhat account

BeforeAll(async () => {
  // Start a local Hardhat node in the background
  hardhatNode = exec('cd hardhat && npx hardhat node');

  // Wait a bit for the node to start
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Deploy the contracts to the local node
  await execAsync('cd hardhat && npx hardhat run scripts/deploy.js --network localhost');

  browser = await chromium.launch();
});

AfterAll(async () => {
  await browser.close();
  // Stop the Hardhat node
  hardhatNode.kill();
});

Given('I am authenticated and on the homepage', async function () {
  // BLOCKER: This step is not fully implemented. It requires injecting a Playwright-controlled
  // "signer" into the frontend application's context, so that transactions
  // signed in the browser (e.g., minting an NFT) can be executed against
  // our local Hardhat test network.
  await page.goto('http://localhost:3000');
  return 'pending';
});

When('I click the "Buy Nation Pass" button', async function () {
  await page.click('button:has-text("Buy Nation Pass")');
});

Then('the transaction should be successful', async function () {
  // In a real test, we would wait for a confirmation message on the UI.
  // Here, we'll just wait a bit to allow time for the transaction to be mined.
  await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
});

Then('my Nation Pass balance should be 1', async function () {
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/');
  const contract = getNationPassContract(provider);
  const balance = await contract.balanceOf(MOCK_WALLET_ADDRESS);
  expect(Number(balance)).toBe(1);
});
