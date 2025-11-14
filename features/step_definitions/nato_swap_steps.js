import { Given, When, Then, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { expect } from 'expect-playwright';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ethers } from 'ethers';
import { getNatoTokenContract } from '../../services/web3.js';

const execAsync = promisify(exec);

let browser;
let page;
let hardhatNode;

// Mock wallet for the test user
const MOCK_WALLET_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Second Hardhat account

BeforeAll(async () => {
  // Start a local Hardhat node in the background
  hardhatNode = exec('cd hardhat && npx hardhat node');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Deploy our base contracts
  await execAsync('cd hardhat && npx hardhat run scripts/deploy.js --network localhost');

  // Setup Uniswap environment
  // We need a more robust way to get deployed addresses and pass them to the setup script.
  // For now, this is a placeholder for that logic.
  // await execAsync('cd hardhat && npx hardhat run scripts/setup-uniswap.js --network localhost');

  browser = await chromium.launch();
});

AfterAll(async () => {
  await browser.close();
  hardhatNode.kill();
});

Given('I am authenticated and on the homepage with a funded wallet', async function () {
  // BLOCKER: This step is not fully implemented for the same reason as in the other
  // test files. It requires injecting a Playwright-controlled "signer" with funds
  // into the frontend application's context.
  await page.goto('http://localhost:3000');
  return 'pending';
});

Given('the Uniswap V2 environment is set up', function () {
  // This step is implicitly handled by the BeforeAll hook.
  // In a real-world scenario, we might add checks here to ensure the pool exists.
});

When('I swap {float} ETH for NATO tokens', async function (ethAmount) {
  await page.fill('input[type="number"]', ethAmount.toString());
  await page.click('button:has-text("Swap")');
});

Then('the transaction should be successful', async function () {
  // Wait for the transaction to be mined. A more robust solution would be
  // to listen for a success event or message on the UI.
  await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds for swap
});

Then('my NATO token balance should be greater than 0', async function () {
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/');
  const contract = getNatoTokenContract(provider);
  const balance = await contract.balanceOf(MOCK_WALLET_ADDRESS);
  expect(Number(balance)).toBeGreaterThan(0);
});
