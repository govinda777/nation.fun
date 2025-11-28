// src/lib/agents/types.ts

/**
 * Representa a configuração de um agente no sistema Nation.fun.
 */
export interface Agent {
  id: string;
  name: string;
  personality: string;
  skills: Skill[];
}

/**
 * Define uma habilidade que um agente pode possuir.
 */
export interface Skill {
  name: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

/**
 * Estrutura de uma mensagem trocada com o agente.
 */
export interface Message {
  chatId: string;
  agentId: string;
  content: string;
  response: string;
  confidenceScore: number;
  timestamp: Date | string;
}

/**
 * Representa um Tweet recuperado da API do Twitter.
 * Simplificado para conter apenas os campos necessários.
 */
export interface Tweet {
  id: string;
  text: string;
  author_id?: string;
}
