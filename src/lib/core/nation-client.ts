/**
 * Nation.fun AI Client
 * 
 * Cliente para integração com a API Nation.fun.
 * Responsável por enviar mensagens e receber respostas da IA.
 */

export interface NationAgentResponse {
  response: string;
  conversationId?: string;
  metadata?: Record<string, any>;
}

export interface NationAgentConfig {
  apiKey: string;
  agentId: string;
  baseUrl?: string;
  timeout?: number;
}

export default class NationAgentClient {
  private apiKey: string;
  private agentId: string;
  private baseUrl: string;
  private timeout: number;

  constructor(
    apiKey: string,
    agentId: string,
    config?: Partial<Pick<NationAgentConfig, 'baseUrl' | 'timeout'>>
  ) {
    this.apiKey = apiKey;
    this.agentId = agentId;
    this.baseUrl = config?.baseUrl || process.env.NATION_API_BASE_URL || 'https://api.nation.fun/v1';
    this.timeout = config?.timeout || 30000; // 30 segundos
  }

  /**
   * Envia uma mensagem para o agente Nation.fun e retorna a resposta
   * @param text Texto da mensagem do usuário
   * @param conversationId ID da conversa (opcional)
   * @returns Resposta do agente
   */
  async sendMessage(
    text: string,
    conversationId?: string
  ): Promise<NationAgentResponse> {
    try {
      console.log(`🤖 [Nation.fun] Enviando mensagem para agente ${this.agentId}...`);

      const response = await this.makeRequest('/chat', {
        method: 'POST',
        body: JSON.stringify({
          agentId: this.agentId,
          message: text,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Nation.fun API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log(`✅ [Nation.fun] Resposta recebida`);

      return {
        response: data.response || data.message || 'Sem resposta',
        conversationId: data.conversationId,
        metadata: data.metadata,
      };
    } catch (error) {
      console.error(`❌ [Nation.fun] Erro ao enviar mensagem:`, error);
      throw new Error(
        `Falha ao comunicar com Nation.fun: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    }
  }

  /**
   * Faz uma requisição HTTP para a API Nation.fun
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers,
        },
        signal: controller.signal,
      });

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Verifica se o agente está disponível
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/health', {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error(`❌ [Nation.fun] Health check falhou:`, error);
      return false;
    }
  }

  /**
   * Obtém informações sobre o agente
   */
  async getAgentInfo(): Promise<any> {
    try {
      const response = await this.makeRequest(`/agents/${this.agentId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to get agent info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ [Nation.fun] Erro ao buscar info do agente:`, error);
      throw error;
    }
  }
}
