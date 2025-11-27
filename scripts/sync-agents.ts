import * as fs from 'fs';
import { loadLocalAgentDefinitions } from '../src/lib/iac/loader';
import { mapToNationAPI } from '../src/lib/iac/mapper';
import { diffAgent } from '../src/lib/iac/differ';
import { AgentDefinition, NationAgentConfig } from '../src/lib/iac/types';

// #################################################################################
// # MOCK API CLIENT
// #################################################################################

// In-memory store to simulate the remote state of agents on the Nation platform.
const remoteAgentStore: Map<string, NationAgentConfig> = new Map();

// Pre-populate the store to simulate an existing agent for update tests.
const existingAgentPayload = mapToNationAPI({
  id: 'research-agent',
  version: 'v1',
  address: 'research-agent-v1',
  name: 'Research Bot V1',
  description: 'Bot para pesquisa automatizada de mercado.',
  skills: ['web-search', 'data-analysis'],
  config: { language: 'pt', maxQueryTokens: 1000 },
});
remoteAgentStore.set('research-agent-v1', existingAgentPayload);


const mockNationApiClient = {
  createAgent: async (payload: NationAgentConfig): Promise<NationAgentConfig> => {
    console.log(`[API Mock] Creating agent with ID: ${payload.id}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    remoteAgentStore.set(payload.id, payload);
    return payload;
  },
  fetchAgent: async (address: string): Promise<NationAgentConfig | null> => {
    console.log(`[API Mock] Fetching agent with address: ${address}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return remoteAgentStore.get(address) || null;
  },
  updateAgent: async (address: string, payload: NationAgentConfig): Promise<NationAgentConfig> => {
    console.log(`[API Mock] Updating agent with address: ${address}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    remoteAgentStore.set(address, payload);
    return payload;
  },
};

// #################################################################################
// # FILE UPDATER
// #################################################################################

async function updateAgentFile(filePath: string, newAddress: string): Promise<void> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updatedContent = content.replace(/address:\s*['"].*['"]/, `address: '${newAddress}'`);
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf-8');
      console.log(`[Updater] Successfully updated ${filePath} with new address.`);
    }
  } catch (error) {
    console.error(`[Updater] Failed to update agent file ${filePath}:`, error);
  }
}

// #################################################################################
// # MAIN SYNC LOGIC
// #################################################################################

async function syncAgents() {
  console.log('--- Starting agent synchronization process ---');
  const localAgents = await loadLocalAgentDefinitions();

  if (localAgents.length === 0) {
    console.log('No local agent definitions found. Nothing to sync.');
    return;
  }

  for (const agentFile of localAgents) {
    const { definition, filePath } = agentFile;
    const agentId = `${definition.id}@${definition.version}`;
    console.log(`\nProcessing agent: ${agentId}`);

    const apiPayload = mapToNationAPI(definition);

    if (!definition.address) {
      // --- CREATE FLOW ---
      console.log(`Address not found. Creating new agent...`);
      const createdAgent = await mockNationApiClient.createAgent(apiPayload);
      if (createdAgent && createdAgent.id) {
        await updateAgentFile(filePath, createdAgent.id);
      } else {
        console.error(`Failed to create agent ${agentId}.`);
      }
    } else {
      // --- DIFF & UPDATE FLOW ---
      const remoteAgent = await mockNationApiClient.fetchAgent(definition.address);
      if (!remoteAgent) {
        console.error(`Agent "${agentId}" has an address but was not found remotely. Manual review required.`);
        continue;
      }

      const differences = diffAgent(definition, remoteAgent);

      if (differences.length > 0) {
        console.log(`Found ${differences.length} differences. Updating remote agent...`);
        differences.forEach(diff => {
          console.log(`  - Field: ${diff.field}, Local: ${JSON.stringify(diff.local)}, Remote: ${JSON.stringify(diff.remote)}`);
        });
        await mockNationApiClient.updateAgent(definition.address, apiPayload);
        console.log(`Agent ${agentId} updated successfully.`);
      } else {
        console.log(`Agent ${agentId} is already in sync.`);
      }
    }
  }

  console.log('\n--- Agent synchronization process finished ---');
}

// Execute the main function
syncAgents();
