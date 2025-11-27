import { AgentDefinition, NationAgentConfig } from './types';
import { mapFromNationAPI } from './mapper';
import { deepEqual } from 'assert';

// Represents a single difference found between a local and remote agent.
export interface AgentDiff {
  type: 'update' | 'none';
  field?: string;
  local?: any;
  remote?: any;
}

/**
 * Compares a local agent definition with its remote counterpart from the Nation API.
 * @param local The local agent definition from a TypeScript file.
 * @param remote The agent configuration fetched from the Nation API.
 * @returns An array of AgentDiff objects detailing the differences. If no diffs, returns an empty array.
 */
export function diffAgent(local: AgentDefinition, remote: NationAgentConfig): AgentDiff[] {
  const diffs: AgentDiff[] = [];

  // The remote config needs to be mapped back to our local format for a true comparison.
  const remoteAsLocal = mapFromNationAPI(remote);

  // Compare field by field
  if (local.name !== remoteAsLocal.name) {
    diffs.push({ type: 'update', field: 'name', local: local.name, remote: remoteAsLocal.name });
  }

  if (local.description !== remoteAsLocal.description) {
    diffs.push({ type: 'update', field: 'description', local: local.description, remote: remoteAsLocal.description });
  }

  // For arrays, sort them to ensure order doesn't cause a false positive diff.
  const localSkills = [...local.skills].sort();
  const remoteSkills = [...remoteAsLocal.skills].sort();
  if (JSON.stringify(localSkills) !== JSON.stringify(remoteSkills)) {
    diffs.push({ type: 'update', field: 'skills', local: local.skills, remote: remoteAsLocal.skills });
  }

  // For the config object, we need to compare apples to apples. The remote version
  // will have default values added by the mapper. We should compare against a similarly
  // mapped local version.
  const localConfigWithDefaults = {
    language: local.config?.language || 'en',
    model: local.config?.model || 'gpt-4',
    temperature: local.config?.temperature || 0.7,
    maxTokens: local.config?.maxTokens || 2000,
  };

  try {
    deepEqual(localConfigWithDefaults, remoteAsLocal.config);
  } catch (e) {
    diffs.push({ type: 'update', field: 'config', local: local.config, remote: remoteAsLocal.config });
  }

  return diffs;
}
