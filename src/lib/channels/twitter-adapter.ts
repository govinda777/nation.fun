/**
 * Twitter Adapter
 * 
 * Implementação do ChannelAdapter para Twitter/X usando a API v2.
 * Usa polling para verificar mentions periodicamente.
 */

import { ChannelAdapter, Message } from './base-channel-adapter';

// Interface temporária para Twitter (substituir por biblioteca real)
interface TwitterClient {
  v2: {
    mentions(): Promise<{ data?: Array<{
      id: string;
      text: string;
      author_id?: string;
      created_at?: string;
    }>}>;
    reply(text: string, replyToId: string): Promise<any>;
  };
}

export class TwitterAdapter implements ChannelAdapter {
  readonly channelType = 'twitter' as const;
  
  private client: any; // TwitterClient quando implementar
  private callback: ((message: Message) => Promise<void>) | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private lastProcessedId: string | null = null;
  private pollIntervalMs: number = 60000; // 1 minuto

  constructor(
    apiKey: string,
    apiSecret: string,
    accessToken?: string,
    accessSecret?: string
  ) {
    // TODO: Inicializar cliente Twitter real
    // this.client = new Twitter({
    //   appKey: apiKey,
    //   appSecret: apiSecret,
    //   accessToken,
    //   accessSecret,
    // });
    
    console.log('🐦 TwitterAdapter criado (mock mode)');
  }

  /**
   * Define o callback para processar mensagens
   */
  async listen(callback: (message: Message) => Promise<void>): Promise<void> {
    this.callback = callback;
  }

  /**
   * Envia resposta como reply ao tweet
   */
  async send(recipientId: string, text: string): Promise<void> {
    try {
      // TODO: Implementar envio real
      // await this.client.v2.reply(text, recipientId);
      console.log(`📤 [Twitter] Enviando reply para ${recipientId}: ${text}`);
    } catch (error) {
      console.error('❌ Erro ao enviar tweet:', error);
      throw error;
    }
  }

  /**
   * Inicia polling de mentions
   */
  async start(): Promise<void> {
    if (this.intervalId) {
      console.warn('⚠️  Twitter adapter já está rodando');
      return;
    }

    console.log(`🚀 Iniciando polling do Twitter (intervalo: ${this.pollIntervalMs}ms)`);
    
    // Primeira verificação imediata
    await this.checkMentions();
    
    // Polling periódico
    this.intervalId = setInterval(async () => {
      await this.checkMentions();
    }, this.pollIntervalMs);
  }

  /**
   * Para o polling
   */
  async stop(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️  Twitter adapter parado');
    }
  }

  /**
   * Verifica mentions e processa novas mensagens
   */
  private async checkMentions(): Promise<void> {
    try {
      // TODO: Implementar busca real de mentions
      // const mentions = await this.client.v2.mentions();
      
      console.log('🔍 Verificando mentions no Twitter...');
      
      // Mock de dados para teste
      const mentions: { data: { id: string; text: string; author_id?: string; created_at?: string; }[] } = { data: [] };
      
      if (!mentions.data || mentions.data.length === 0) {
        return;
      }

      for (const tweet of mentions.data) {
        // Evita processar o mesmo tweet duas vezes
        if (tweet.id === this.lastProcessedId) {
          break;
        }

        const message: Message = {
          id: tweet.id,
          text: tweet.text,
          sender: {
            id: tweet.author_id || 'unknown',
            name: 'Twitter User',
          },
          timestamp: new Date(tweet.created_at || Date.now()),
        };

        if (this.callback) {
          await this.callback(message);
        }
      }

      // Atualiza último ID processado
      if (mentions.data.length > 0) {
        this.lastProcessedId = mentions.data[0].id;
      }
    } catch (error) {
      console.error('❌ Erro ao verificar mentions:', error);
    }
  }
}
