import { rateLimit, _reset } from '@/lib/rate-limiter';

describe('rateLimit', () => {
  beforeEach(() => {
    _reset();
    // Mock Date.now() to control time in tests
    jest.spyOn(Date, 'now').mockReturnValue(0);
  });

  it('should allow the first request', async () => {
    const result = await rateLimit('test-ip');
    expect(result.success).toBe(true);
  });

  it('should allow requests up to the limit', async () => {
    for (let i = 0; i < 10; i++) {
      const result = await rateLimit('test-ip');
      expect(result.success).toBe(true);
    }
  });

  it('should block requests exceeding the limit', async () => {
    for (let i = 0; i < 10; i++) {
      await rateLimit('test-ip');
    }
    const result = await rateLimit('test-ip');
    expect(result.success).toBe(false);
  });

  it('should allow requests after the window resets', async () => {
    for (let i = 0; i < 10; i++) {
      await rateLimit('test-ip');
    }
    const blockedResult = await rateLimit('test-ip');
    expect(blockedResult.success).toBe(false);

    // Advance time beyond the window
    jest.spyOn(Date, 'now').mockReturnValue(60 * 1000 + 1);

    const allowedResult = await rateLimit('test-ip');
    expect(allowedResult.success).toBe(true);
  });
});
