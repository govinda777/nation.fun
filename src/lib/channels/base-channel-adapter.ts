/**
 * Base Channel Adapter Interface
 * 
 * Define a interface padrão que todos os adapters de canal devem implementar.
 * Isso garante consistência e facilita a adição de novos canais.
 */

export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: Date;
}

export interface ChannelAdapter {
  /**
   * Receber mensagens do canal
   * @param callback Função chamada quando uma nova mensagem chega
   */
  listen(callback: (message: Message) => Promise<void>): Promise<void>;

  /**
   * Enviar resposta para o canal
   * @param recipientId ID do destinatário
   * @param text Texto da mensagem
   */
  send(recipientId: string, text: string): Promise<void>;

  /**
   * Iniciar escuta (polling ou webhook)
   */
  start(): Promise<void>;

  /**
   * Parar escuta
   */
  stop(): Promise<void>;

  /**
   * Nome do canal
   */
  readonly channelType: 'whatsapp' | 'twitter' | 'telegram';
}
