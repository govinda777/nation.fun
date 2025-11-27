export interface AgentDefinition {
  id: string;
  version: string;
  address: string; // Will be empty on creation, filled by the sync script
  name: string;
  description: string;
  skills: string[];
  config?: Record<string, any>;
}

export interface NationAgentConfig {
  id: string;
  name: string;
  purpose: string;
  personality: string;
  principles: string;
  prompt: string;
  prompt_append: string;
  skills: SkillConfig;
  llm_model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface SkillConfig {
  [category: string]: {
    states: {
      [skillName: string]: 'public' | 'private' | 'disabled';
    };
  };
}
