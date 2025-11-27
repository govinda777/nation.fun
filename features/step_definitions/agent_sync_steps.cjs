const { Given, When, Then, After, Before } = require('@cucumber/cucumber');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEMP_DIR = path.join(process.cwd(), 'src', 'agents', 'nation');

// Ensure the directory for temporary agent files exists before scenarios run.
Before(function () {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
});

// Cleanup temporary files after each scenario.
After(function () {
  if (!fs.existsSync(TEMP_DIR)) {
    return;
  }
  const files = fs.readdirSync(TEMP_DIR);
  for (const file of files) {
    if (file.endsWith('.ts') && (file.startsWith('new-') || file.startsWith('existing-') || file.startsWith('synced-'))) {
      fs.unlinkSync(path.join(TEMP_DIR, file));
    }
  }
});

// --- GIVEN Steps ---

Given('a local agent definition file {string} with an empty address', function (fileName) {
  const content = `
    import { AgentDefinition } from '../../lib/iac/types';
    export const TestAgent: AgentDefinition = {
      id: 'test-agent', version: 'v1', address: '', name: 'Test',
      description: 'Test desc', skills: [], config: {}
    };
  `;
  fs.writeFileSync(path.join(TEMP_DIR, fileName), content.trim());
  this.fileName = fileName;
});

Given('a local agent definition file {string} with a known address and a remote version that is out of sync', function (fileName) {
  // The sync script is pre-configured with a remote agent.
  // We create a local version that is different.
  const content = `
    import { AgentDefinition } from '../../lib/iac/types';
    export const TestAgent: AgentDefinition = {
      id: 'research-agent', version: 'v1', address: 'research-agent-v1', name: 'New Name',
      description: 'A new description.', skills: ['web-search'], config: {}
    };
  `;
  fs.writeFileSync(path.join(TEMP_DIR, fileName), content.trim());
  this.fileName = fileName;
});

Given('a local agent definition file {string} with a known address and a remote version that is in sync', function (fileName) {
  // The sync script's pre-populated data matches this definition.
  const content = `
    import { AgentDefinition } from '../../lib/iac/types';
    export const TestAgent: AgentDefinition = {
      id: 'research-agent', version: 'v1', address: 'research-agent-v1',
      name: 'Research Bot V1', description: 'Bot para pesquisa automatizada de mercado.',
      skills: ['web-search', 'data-analysis'], config: { language: 'pt', maxQueryTokens: 1000 }
    };
  `;
  fs.writeFileSync(path.join(TEMP_DIR, fileName), content.trim());
  this.fileName = fileName;
});

// --- WHEN Step ---

When('I run the agent synchronization script', function () {
  try {
    const output = execSync('npm run agents:sync', { encoding: 'utf-8' });
    this.scriptOutput = output;
  } catch (error) {
    this.scriptOutput = error.stdout + error.stderr;
    // Allow for errors if needed, but for these tests, we expect success.
  }
});

// --- THEN Steps ---

Then('the agent definition file {string} should be updated with a new address', function (fileName) {
  const filePath = path.join(TEMP_DIR, fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  // Check that `address: ''` was replaced with a non-empty address.
  expect(content).to.not.include("address: ''");
  expect(content).to.match(/address:\s*'test-agent-v1'/);
});

Then('the script output should indicate that an update was performed', function () {
  expect(this.scriptOutput).to.include('differences. Updating remote agent...');
  expect(this.scriptOutput).to.include('updated successfully');
});

Then('the script output should indicate that the agent is already in sync', function () {
  expect(this.scriptOutput).to.include('is already in sync');
});
