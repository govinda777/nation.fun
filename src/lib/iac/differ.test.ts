import { describe, it, expect } from '@jest/globals';
import { diffAgent } from './differ';
import { AgentDefinition, NationAgentConfig } from './types';

describe('Agent Differ', () => {
  const baseLocal: AgentDefinition = {
    id: 'test-agent',
    version: 'v1',
    address: 'test-agent-v1',
    name: 'Test Agent',
    description: 'A test agent.',
    skills: ['web-search'],
    config: { language: 'en' },
  };

  const baseRemote: NationAgentConfig = {
    id: 'test-agent-v1',
    name: 'Test Agent',
    purpose: 'A test agent.',
    personality: '',
    principles: '',
    prompt: 'Language preference: en',
    prompt_append: '',
    skills: { web_search: { states: { search_web: 'public' } } },
    llm_model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 2000,
  };

  it('should return an empty array when there are no differences', () => {
    const diffs = diffAgent(baseLocal, baseRemote);
    expect(diffs).toHaveLength(0);
  });

  it('should detect a difference in the description field', () => {
    const modifiedLocal = { ...baseLocal, description: 'A new description' };
    const diffs = diffAgent(modifiedLocal, baseRemote);
    expect(diffs).toHaveLength(1);
    expect(diffs[0].field).toBe('description');
    expect(diffs[0].local).toBe('A new description');
    expect(diffs[0].remote).toBe('A test agent.');
  });

  it('should detect a difference in the skills array', () => {
    const modifiedLocal = { ...baseLocal, skills: ['web-search', 'data-analysis'] };
    const diffs = diffAgent(modifiedLocal, baseRemote);
    expect(diffs).toHaveLength(1);
    expect(diffs[0].field).toBe('skills');
    expect(diffs[0].local).toEqual(['web-search', 'data-analysis']);
  });

  it('should detect a difference in the config object', () => {
    const modifiedLocal = { ...baseLocal, config: { language: 'pt' } };
    const diffs = diffAgent(modifiedLocal, baseRemote);
    expect(diffs).toHaveLength(1);
    expect(diffs[0].field).toBe('config');
  });

  it('should detect multiple differences', () => {
    const modifiedLocal = {
      ...baseLocal,
      name: 'New Name',
      skills: ['new-skill'],
    };
    const diffs = diffAgent(modifiedLocal, baseRemote);
    expect(diffs).toHaveLength(2);
    expect(diffs.some(d => d.field === 'name')).toBe(true);
    expect(diffs.some(d => d.field === 'skills')).toBe(true);
  });
});
