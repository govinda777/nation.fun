import { AgentDefinition, NationAgentConfig, SkillConfig } from './types';

// #################################################################################
// # MAP FROM LOCAL DEFINITION TO NATION API PAYLOAD
// #################################################################################

/**
 * Maps a local AgentDefinition to the format expected by the Nation API.
 * This includes generating dynamic prompts and mapping skill structures.
 * @param agent The local agent definition.
 * @returns The configuration payload for the Nation API.
 */
export function mapToNationAPI(agent: AgentDefinition): Omit<NationAgentConfig, 'id'> & { id: string } {
  const fullId = `${agent.id}-${agent.version}`;
  const mappedSkills = mapSkillsToArray(agent.skills);
  const prompts = generatePrompts(agent.description, agent.skills, agent.config);

  return {
    id: fullId,
    name: agent.name,
    purpose: agent.description,
    personality: prompts.personality,
    principles: prompts.principles,
    prompt: prompts.main,
    prompt_append: prompts.append,
    skills: mappedSkills,
    llm_model: agent.config?.model || 'gpt-4',
    temperature: agent.config?.temperature || 0.7,
    max_tokens: agent.config?.maxTokens || 2000,
  };
}

function mapSkillsToArray(skillNames: string[]): SkillConfig {
  const skills: SkillConfig = {};
  for (const skillName of skillNames) {
    const category = skillName.replace(/-/g, '_');
    skills[category] = {
      states: {
        [getMainSkillAction(category)]: 'public',
      },
    };
  }
  return skills;
}

function getMainSkillAction(category: string): string {
  const skillMap: Record<string, string> = {
    'web_search': 'search_web',
    'data_analysis': 'analyze_data',
    'common': 'current_time',
  };
  return skillMap[category] || category;
}

function generatePrompts(description: string, skills: string[], config?: Record<string, any>) {
  return {
    personality: generatePersonality(skills),
    principles: generatePrinciples(skills),
    main: generateMainPrompt(description, skills, config),
    append: generateAppendPrompt(config),
  };
}

function generatePersonality(skills: string[]): string {
  const traits: string[] = [];
  if (skills.includes('web-search')) traits.push('research-oriented');
  if (skills.includes('data-analysis')) traits.push('analytical');
  return traits.length > 0 ? `Professional, ${traits.join(', ')}, and helpful.` : 'Professional and helpful.';
}

function generatePrinciples(skills: string[]): string {
  const principles = ['- Always provide accurate information'];
  if (skills.includes('web-search')) principles.push('- Cite sources for all research data');
  return principles.join('\n');
}

function generateMainPrompt(description: string, skills: string[], config?: Record<string, any>): string {
  const language = config?.language || 'en';
  const skillDescriptions = skills.map(s => `- ${s.replace(/-/g, ' ')}`).join('\n');
  return `You are an AI agent. Purpose: ${description}\nYour capabilities include:\n${skillDescriptions}\nLanguage preference: ${language}`;
}

function generateAppendPrompt(config?: Record<string, any>): string {
  const language = config?.language || 'en';
  const messages: Record<string, string> = {
    'pt': 'Lembre-se de sempre responder em Português.',
    'en': 'Remember to always respond in English.',
  };
  return messages[language] || messages['en'];
}

// #################################################################################
// # MAP FROM NATION API RESPONSE TO LOCAL DEFINITION
// #################################################################################

/**
 * Maps a Nation API response back to the local AgentDefinition format.
 * This is used for diffing and comparison.
 * @param apiAgent The agent configuration from the Nation API.
 * @returns An AgentDefinition object.
 */
export function mapFromNationAPI(apiAgent: NationAgentConfig): AgentDefinition {
  const [id, version] = parseFullId(apiAgent.id);
  const skills = extractSkills(apiAgent.skills);
  const config = extractConfig(apiAgent);

  return {
    id,
    version,
    address: apiAgent.id, // The full ID from the API serves as the unique address
    name: apiAgent.name,
    description: apiAgent.purpose,
    skills,
    config,
  };
}

function parseFullId(fullId: string): [string, string] {
  const parts = fullId.split('-');
  const version = parts.pop() || 'v1';
  const id = parts.join('-');
  return [id, version];
}

function extractSkills(skillConfig: SkillConfig): string[] {
  return Object.keys(skillConfig).map(category => category.replace(/_/g, '-'));
}

function extractConfig(apiAgent: NationAgentConfig): Record<string, any> {
  const language = extractLanguage(apiAgent.prompt);
  return {
    language,
    model: apiAgent.llm_model,
    temperature: apiAgent.temperature,
    maxTokens: apiAgent.max_tokens,
  };
}

function extractLanguage(prompt: string): string {
  if (prompt.includes('Language preference: pt')) return 'pt';
  return 'en';
}
