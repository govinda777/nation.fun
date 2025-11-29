/**
 * Agent Engine - Core Reaproveitável
 * 
 * Orquestra a comunicação entre o channel adapter e a API Nation.fun.
 * Toda lógica de processamento de mensagens está aqui.
 */

import { ChannelAdapter, Message } from '../channels/base-channel-adapter';
import NationAgentClient from './nation-client';

export class AgentEngine {
  private adapter: ChannelAdapter;
  private nationClient: NationAgentClient;
  private isRunning: boolean = false;

  constructor(
    adapter: ChannelAdapter,
    agentId: string,
    nationApiKey: string
  ) {
    this.adapter = adapter;
    this.nationClient = new NationAgentClient(nationApiKey, agentId);
  }

  /**
   * Inicializa o agente e começa a escutar mensagens
   */
  async initialize(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Agente já está rodando');
    }

    // Define o callback para processar mensagens
    await this.adapter.listen(async (message) => {
      await this.handleMessage(message);
    });

    // Inicia a escuta no canal
    await this.adapter.start();
    this.isRunning = true;

    console.log(`✅ Agente iniciado no canal: ${this.adapter.channelType}`);
  }

  /**
   * Processa uma mensagem recebida
   */
  private async handleMessage(message: Message): Promise<void> {
    try {
      console.log(
        `[${this.adapter.channelType}] Mensagem de ${message.sender.name}: ${message.text}`
      );

      // Processa com Nation.fun AI
      const aiResponse = await this.nationClient.sendMessage(message.text);

      // Envia resposta no canal
      await this.adapter.send(message.sender.id, aiResponse.response);

      console.log(`✅ [${this.adapter.channelType}] Resposta enviada`);
    } catch (error) {
      console.error(`❌ Erro ao processar mensagem:`, error);
      
      // Tenta enviar mensagem de erro ao usuário
      try {
        await this.adapter.send(
          message.sender.id,
          'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.'
        );
      } catch (sendError) {
        console.error('❌ Erro ao enviar mensagem de erro:', sendError);
      }
    }
  }

  /**
   * Para o agente
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.warn('Agente já está parado');
      return;
    }

    await this.adapter.stop();
    this.isRunning = false;

    console.log(`⏹️  Agente parado no canal: ${this.adapter.channelType}`);
  }

  /**
   * Retorna o status do agente
   */
  getStatus(): {
    isRunning: boolean;
    channelType: string;
  } {
    return {
      isRunning: this.isRunning,
      channelType: this.adapter.channelType,
    };
  }
}
