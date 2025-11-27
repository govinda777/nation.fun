import { describe, it, expect } from '@jest/globals';
import { mapToNationAPI, mapFromNationAPI } from './mapper';
import { AgentDefinition, NationAgentConfig } from './types';

describe('Agent Data Mapper', () => {
  const localAgent: AgentDefinition = {
    id: 'test-agent',
    version: 'v1',
    address: 'test-agent-v1',
    name: 'Test Agent',
    description: 'A test agent for mapping.',
    skills: ['web-search', 'data-analysis'],
    config: { language: 'pt', temperature: 0.8 },
  };

  const nationAgent: NationAgentConfig = {
    id: 'test-agent-v1',
    name: 'Test Agent',
    purpose: 'A test agent for mapping.',
    personality: 'Professional, research-oriented, analytical, and helpful.',
    principles: '- Always provide accurate information\n- Cite sources for all research data',
    prompt: 'You are an AI agent. Purpose: A test agent for mapping.\nYour capabilities include:\n- web search\n- data analysis\nLanguage preference: pt',
    prompt_append: 'Lembre-se de sempre responder em Português.',
    skills: {
      web_search: { states: { search_web: 'public' } },
      data_analysis: { states: { analyze_data: 'public' } },
    },
    llm_model: 'gpt-4',
    temperature: 0.8,
    max_tokens: 2000,
  };

  describe('mapToNationAPI', () => {
    it('should correctly map a local agent definition to the Nation API format', () => {
      const result = mapToNationAPI(localAgent);

      expect(result.id).toBe('test-agent-v1');
      expect(result.name).toBe('Test Agent');
      expect(result.purpose).toBe('A test agent for mapping.');
      expect(result.skills.web_search).toBeDefined();
      expect(result.skills.data_analysis).toBeDefined();
      expect(result.temperature).toBe(0.8);
      // Check default value
      expect(result.max_tokens).toBe(2000);
      // Check generated prompt
      expect(result.prompt).toContain('Purpose: A test agent for mapping.');
      expect(result.prompt).toContain('Language preference: pt');
    });

    it('should apply default values for config fields that are not provided', () => {
      const simpleAgent: AgentDefinition = { ...localAgent, config: {} };
      const result = mapToNationAPI(simpleAgent);

      expect(result.temperature).toBe(0.7); // Default
      expect(result.llm_model).toBe('gpt-4'); // Default
    });
  });

  describe('mapFromNationAPI', () => {
    it('should correctly map a Nation API config back to a local agent definition', () => {
      const result = mapFromNationAPI(nationAgent);

      expect(result.id).toBe('test-agent');
      expect(result.version).toBe('v1');
      expect(result.address).toBe('test-agent-v1');
      expect(result.name).toBe('Test Agent');
      expect(result.description).toBe('A test agent for mapping.');
      expect(result.skills).toEqual(['web-search', 'data-analysis']);
      expect(result.config.temperature).toBe(0.8);
      expect(result.config.language).toBe('pt');
    });
  });
});
