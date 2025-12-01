// In-memory rate limiter (para produção, usar Redis)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const LIMIT = 10; // 10 requests
const WINDOW = 60 * 1000; // 1 minute

export async function rateLimit(identifier: string): Promise<{ success: boolean }> {
  const now = Date.now();
  const entry = store.get(identifier);

  // Limpar entrada expirada
  if (entry && entry.resetAt < now) {
    store.delete(identifier);
  }

  const current = store.get(identifier);

  if (!current) {
    // Primeira requisição
    store.set(identifier, {
      count: 1,
      resetAt: now + WINDOW,
    });
    return { success: true };
  }

  if (current.count >= LIMIT) {
    return { success: false };
  }

  // Incrementar contador
  current.count++;
  store.set(identifier, current);

  return { success: true };
}

// NOTE: Exported for testing purposes only
export function _reset() {
  store.clear();
}
