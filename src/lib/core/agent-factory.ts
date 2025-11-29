/**
 * Agent Factory - Criação de Agentes
 * 
 * Factory pattern para criar agentes com diferentes canais.
 * Centraliza a lógica de criação e validação.
 */

import { ChannelAdapter } from '../channels/base-channel-adapter';
import { TwitterAdapter } from '../channels/twitter-adapter';
import { AgentEngine } from './agent-engine';

export type ChannelType = 'whatsapp' | 'twitter' | 'telegram';

export interface AgentConfig {
  agentId: string;
  nationApiKey: string;
  channelType: ChannelType;
  channelCredentials: {
    // WhatsApp
    sessionId?: string;
    
    // Twitter
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    accessSecret?: string;
    
    // Telegram
    botToken?: string;
  };
}

export class AgentFactory {
  /**
   * Cria um agente com o canal especificado
   */
  static createAgent(config: AgentConfig): AgentEngine {
    const adapter = this.createAdapter(
      config.channelType,
      config.channelCredentials
    );
    return new AgentEngine(adapter, config.agentId, config.nationApiKey);
  }

  /**
   * Cria o adapter apropriado para o canal
   */
  private static createAdapter(
    channelType: ChannelType,
    credentials: AgentConfig['channelCredentials']
  ): ChannelAdapter {
    switch (channelType) {
      case 'twitter':
        if (!credentials.apiKey || !credentials.apiSecret) {
          throw new Error('Twitter: apiKey e apiSecret são obrigatórios');
        }
        return new TwitterAdapter(
          credentials.apiKey,
          credentials.apiSecret,
          credentials.accessToken,
          credentials.accessSecret
        );

      case 'telegram':
        if (!credentials.botToken) {
          throw new Error('Telegram: botToken é obrigatório');
        }
        // TODO: Implementar TelegramAdapter
        throw new Error('Telegram adapter ainda não implementado');

      case 'whatsapp':
        if (!credentials.sessionId) {
          throw new Error('WhatsApp: sessionId é obrigatório');
        }
        // TODO: Implementar WhatsAppAdapter
        throw new Error('WhatsApp adapter ainda não implementado');

      default:
        throw new Error(`Canal não suportado: ${channelType}`);
    }
  }
}
