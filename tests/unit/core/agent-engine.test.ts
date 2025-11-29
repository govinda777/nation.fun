/**
 * Testes Unitários - Agent Engine
 */

import { AgentEngine } from '@/src/lib/core/agent-engine';
import { ChannelAdapter, Message } from '@/src/lib/channels/base-channel-adapter';

// Mock do ChannelAdapter
class MockAdapter implements ChannelAdapter {
  readonly channelType = 'twitter' as const;
  private callback: ((message: Message) => Promise<void>) | null = null;
  
  messages: Array<{ recipientId: string; text: string }> = [];
  isStarted = false;

  async listen(callback: (message: Message) => Promise<void>): Promise<void> {
    this.callback = callback;
  }

  async send(recipientId: string, text: string): Promise<void> {
    this.messages.push({ recipientId, text });
  }

  async start(): Promise<void> {
    this.isStarted = true;
  }

  async stop(): Promise<void> {
    this.isStarted = false;
  }

  // Método helper para simular mensagem recebida
  async simulateMessage(message: Message): Promise<void> {
    if (this.callback) {
      await this.callback(message);
    }
  }
}

// Mock do NationAgentClient
jest.mock('@/src/lib/core/nation-client', () => {
  return jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn().mockResolvedValue({
      response: 'Resposta do agente Nation.fun'
    })
  }));
});

describe('AgentEngine', () => {
  let mockAdapter: MockAdapter;
  let engine: AgentEngine;

  beforeEach(() => {
    mockAdapter = new MockAdapter();
    engine = new AgentEngine(mockAdapter, 'test-agent', 'test-api-key');
  });

  afterEach(async () => {
    await engine.stop();
  });

  describe('initialize()', () => {
    it('should initialize successfully', async () => {
      await engine.initialize();
      expect(mockAdapter.isStarted).toBe(true);
    });

    it('should throw error if already running', async () => {
      await engine.initialize();
      await expect(engine.initialize()).rejects.toThrow('já está rodando');
    });
  });

  describe('message handling', () => {
    it('should process incoming message', async () => {
      await engine.initialize();

      const message: Message = {
        id: 'test-msg-1',
        text: 'Olá agente!',
        sender: { id: 'user-1', name: 'Test User' },
        timestamp: new Date()
      };

      await mockAdapter.simulateMessage(message);

      // Verifica se resposta foi enviada
      expect(mockAdapter.messages.length).toBeGreaterThan(0);
      expect(mockAdapter.messages[0].recipientId).toBe('user-1');
    });
  });

  describe('stop()', () => {
    it('should stop successfully', async () => {
      await engine.initialize();
      await engine.stop();
      expect(mockAdapter.isStarted).toBe(false);
    });

    it('should handle stop when not running', async () => {
      await expect(engine.stop()).resolves.not.toThrow();
    });
  });

  describe('getStatus()', () => {
    it('should return correct status when stopped', () => {
      const status = engine.getStatus();
      expect(status.isRunning).toBe(false);
      expect(status.channelType).toBe('twitter');
    });

    it('should return correct status when running', async () => {
      await engine.initialize();
      const status = engine.getStatus();
      expect(status.isRunning).toBe(true);
      expect(status.channelType).toBe('twitter');
    });
  });
});
