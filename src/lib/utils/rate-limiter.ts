// src/lib/utils/rate-limiter.ts

import logger from './logger';

/**
 * Implementa um controle de taxa (rate limiting) em memória.
 *
 * Útil para limitar o número de requisições para APIs externas ou
 * para proteger os próprios endpoints da aplicação.
 */
class RateLimiter {
  // Armazena as contagens de requisição para cada identificador.
  private counts: Map<string, { count: number; resetTime: number }> = new Map();

  /**
   * Verifica se uma requisição é permitida para um dado identificador.
   *
   * @param identifier - Uma string única para a entidade a ser limitada (ex: IP, user ID).
   * @param maxRequests - O número máximo de requisições permitidas na janela de tempo.
   * @param windowMs - A janela de tempo em milissegundos.
   * @returns `true` se a requisição for permitida, `false` caso contrário.
   */
  public isAllowed(
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60000 // 1 minuto
  ): boolean {
    const now = Date.now();
    const record = this.counts.get(identifier);

    // Se não há registro ou o registro expirou, cria um novo.
    if (!record || record.resetTime <= now) {
      this.counts.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    // Se a contagem está abaixo do limite, incrementa e permite.
    if (record.count < maxRequests) {
      record.count++;
      return true;
    }

    // Se o limite foi excedido, nega a requisição.
    logger.warn({ identifier }, 'Rate limit exceeded.');
    return false;
  }
}

// Exporta uma instância singleton para ser usada em toda a aplicação.
export default new RateLimiter();
