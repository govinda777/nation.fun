/**
 * Testes Unitários - Agent Factory
 */

import { AgentFactory, AgentConfig } from '@/src/lib/core/agent-factory';

describe('AgentFactory', () => {
  describe('createAgent()', () => {
    it('should create Twitter agent with valid config', () => {
      const config: AgentConfig = {
        agentId: 'test-agent',
        nationApiKey: 'test-key',
        channelType: 'twitter',
        channelCredentials: {
          apiKey: 'twitter-key',
          apiSecret: 'twitter-secret'
        }
      };

      const agent = AgentFactory.createAgent(config);
      expect(agent).toBeDefined();
      expect(agent.getStatus().channelType).toBe('twitter');
    });

    it('should throw error for Twitter without credentials', () => {
      const config: AgentConfig = {
        agentId: 'test-agent',
        nationApiKey: 'test-key',
        channelType: 'twitter',
        channelCredentials: {}
      };

      expect(() => AgentFactory.createAgent(config)).toThrow(
        'Twitter: apiKey e apiSecret são obrigatórios'
      );
    });

    it('should throw error for unsupported Telegram', () => {
      const config: AgentConfig = {
        agentId: 'test-agent',
        nationApiKey: 'test-key',
        channelType: 'telegram',
        channelCredentials: {
          botToken: 'telegram-token'
        }
      };

      expect(() => AgentFactory.createAgent(config)).toThrow(
        'Telegram adapter ainda não implementado'
      );
    });

    it('should throw error for unsupported WhatsApp', () => {
      const config: AgentConfig = {
        agentId: 'test-agent',
        nationApiKey: 'test-key',
        channelType: 'whatsapp',
        channelCredentials: {
          sessionId: 'whatsapp-session'
        }
      };

      expect(() => AgentFactory.createAgent(config)).toThrow(
        'WhatsApp adapter ainda não implementado'
      );
    });
  });
});
