// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';
import { AgentDefinition } from './types';

// Interface to hold both the agent definition and its file path
export interface AgentFile {
  definition: AgentDefinition;
  filePath: string;
}

/**
 * Loads all local agent definitions from the 'src/agents/nation' directory.
 * @returns A promise that resolves to an array of AgentFile objects.
 */
export async function loadLocalAgentDefinitions(): Promise<AgentFile[]> {
  const agentsDir = path.join(process.cwd(), 'src', 'agents', 'nation');
  const agentFiles: AgentFile[] = [];

  try {
    const files = fs.readdirSync(agentsDir);

    for (const file of files) {
      if (file.endsWith('.ts')) {
        const filePath = path.join(agentsDir, file);
        try {
          // Dynamically import the TypeScript module
          const module = await import(filePath);

          // Find the exported agent definition object in the module
          const agentDefinition = Object.values(module).find(
            (exported) => typeof exported === 'object' && exported.id && exported.version
          ) as AgentDefinition | undefined;

          if (agentDefinition) {
            agentFiles.push({ definition: agentDefinition, filePath });
          } else {
            console.warn(`[Loader] Could not find a valid agent definition export in ${file}`);
          }
        } catch (error) {
          console.error(`[Loader] Error importing or processing agent file ${file}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`[Loader] Failed to read agents directory: ${agentsDir}`, error);
  }

  return agentFiles;
}
