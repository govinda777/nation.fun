// __tests__/unit/utils/rate-limiter.test.ts

import RateLimiter from '../../../src/lib/utils/rate-limiter';

describe('RateLimiter', () => {
  // Usa timers falsos para controlar o tempo nos testes
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('deve permitir requisições dentro do limite', () => {
    const identifier = 'test-id-allow';
    const maxRequests = 5;

    for (let i = 0; i < maxRequests; i++) {
      expect(RateLimiter.isAllowed(identifier, maxRequests)).toBe(true);
    }
  });

  it('deve bloquear requisições que excedem o limite', () => {
    const identifier = 'test-id-block';
    const maxRequests = 3;

    // Faz 3 requisições permitidas
    for (let i = 0; i < maxRequests; i++) {
      RateLimiter.isAllowed(identifier, maxRequests);
    }

    // A quarta requisição deve ser bloqueada
    expect(RateLimiter.isAllowed(identifier, maxRequests)).toBe(false);
  });

  it('deve resetar a contagem após a janela de tempo expirar', () => {
    const identifier = 'test-id-reset';
    const maxRequests = 2;
    const windowMs = 60000; // 1 minuto

    // Faz 2 requisições permitidas
    RateLimiter.isAllowed(identifier, maxRequests, windowMs);
    RateLimiter.isAllowed(identifier, maxRequests, windowMs);

    // A terceira deve ser bloqueada
    expect(RateLimiter.isAllowed(identifier, maxRequests, windowMs)).toBe(false);

    // Avança o tempo em 1 minuto
    jest.advanceTimersByTime(windowMs);

    // Agora, a requisição deve ser permitida novamente
    expect(RateLimiter.isAllowed(identifier, maxRequests, windowMs)).toBe(true);
  });
});
