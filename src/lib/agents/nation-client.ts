// src/lib/agents/nation-client.ts

import axios, { AxiosInstance } from 'axios';
import { Message } from './types';
import { BotError } from '../utils/error-handler';
import logger from '../utils/logger';

// Função de delay padrão que usa setTimeout.
const defaultDelay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

/**
 * Cliente para interagir com a API do Nation.fun.
 */
class NationAgentClient {
  private apiClient: AxiosInstance;
  private agentId: string;
  // Injeta a função de delay, permitindo mocks nos testes.
  private delay: (ms: number) => Promise<void>;

  constructor(
    apiKey: string,
    agentId: string,
    baseUrl?: string,
    delayFn: (ms: number) => Promise<void> = defaultDelay
  ) {
    if (!apiKey || !agentId) {
      throw new Error('API Key e Agent ID do Nation.fun são obrigatórios.');
    }
    this.agentId = agentId;
    this.apiClient = axios.create({
      baseURL: baseUrl || process.env.NATION_API_BASE_URL || 'https://api.nation.fun/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    this.delay = delayFn;
  }

  public async sendMessage(
    message: string,
    mode: 'chat' | 'analyze' = 'chat'
  ): Promise<Message> {
    return this.retryWithBackoff(async () => {
      logger.info({ agentId: this.agentId, message }, 'Enviando mensagem para o agente...');
      const response = await this.apiClient.post('/chat', {
        agent_id: this.agentId,
        message,
        mode,
      });
      return response.data as Message;
    });
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let attempt = 1;
    while (true) {
      try {
        return await fn();
      } catch (error) {
        if (attempt > maxRetries) {
          logger.error({ attempt }, 'Máximo de retentativas atingido. Desistindo.');
          throw new BotError('NATION_API_FAILURE', 500, 'Falha ao se comunicar com a API do Nation.fun após múltiplas tentativas.');
        }

        if (axios.isAxiosError(error) && error.response?.status === 429) {
          const retryAfter = parseInt(error.response.headers['retry-after'] || '5', 10);
          logger.warn(`Rate limit atingido. Tentando novamente em ${retryAfter} segundos...`);
          await this.delay(retryAfter * 1000);
        } else {
          const delayAmount = 1000 * Math.pow(2, attempt); // Backoff exponencial
          logger.warn({ attempt, delay: delayAmount }, 'Erro ao se comunicar com a API. Tentando novamente...');
          await this.delay(delayAmount);
        }

        attempt++;
      }
    }
  }
}

export default NationAgentClient;
