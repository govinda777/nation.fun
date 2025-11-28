// __tests__/unit/agents/nation-client.test.ts

import nock from 'nock';
import NationAgentClient from '../../../src/lib/agents/nation-client';
import { Message } from '../../../src/lib/agents/types';

const API_BASE_URL = 'https://api.nation.fun/v1';

// Mock da função de delay que resolve imediatamente.
const mockDelay = async (ms: number) => Promise.resolve();

describe('NationAgentClient', () => {
  let client: NationAgentClient;

  beforeEach(() => {
    // Injeta o mock da função de delay no construtor.
    client = new NationAgentClient('test-key', 'test-agent-id', API_BASE_URL, mockDelay);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('deve enviar uma mensagem com sucesso na primeira tentativa', async () => {
    const timestamp = new Date().toISOString();
    const mockResponse: Message = {
      chatId: 'chat123',
      agentId: 'test-agent-id',
      content: 'Olá',
      response: 'Olá! Como posso ajudar?',
      confidenceScore: 0.9,
      timestamp,
    };

    nock(API_BASE_URL).post('/chat').reply(200, mockResponse);

    const response = await client.sendMessage('Olá');
    expect(response).toEqual(mockResponse);
  });

  it('deve tentar novamente em caso de erro 500', async () => {
    nock(API_BASE_URL).post('/chat').reply(500);
    nock(API_BASE_URL).post('/chat').reply(200, { response: 'Sucesso na segunda tentativa' });

    const response = await client.sendMessage('teste-retry');
    expect(response).toEqual({ response: 'Sucesso na segunda tentativa' });
  });

  it('deve falhar após o número máximo de retentativas', async () => {
    nock(API_BASE_URL).post('/chat').times(4).reply(500);

    await expect(client.sendMessage('teste-falha')).rejects.toThrow(
      'Falha ao se comunicar com a API do Nation.fun após múltiplas tentativas.'
    );
  });

  it('deve esperar o tempo correto em caso de rate limit (429)', async () => {
    let waited = false;
    const customDelay = async (ms: number) => {
        // Verifica se a espera foi de 7 segundos, conforme o header
        if (ms === 7000) waited = true;
        return Promise.resolve();
    };

    const customClient = new NationAgentClient('test-key', 'test-agent-id', API_BASE_URL, customDelay);

    nock(API_BASE_URL)
      .post('/chat')
      .reply(429, {}, { 'Retry-After': '7' });
    nock(API_BASE_URL)
      .post('/chat')
      .reply(200, { response: 'Sucesso' });

    await customClient.sendMessage('teste-rate-limit');
    expect(waited).toBe(true);
  });
});
