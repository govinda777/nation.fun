/**
 * @jest-environment node
 */

import { POST } from '@/app/api/chat/route';
import { NextRequest } from 'next/server';
import { nationClient } from '@/lib/nation-client';
import { rateLimit } from '@/lib/rate-limiter';

// Mock the dependencies
jest.mock('@/lib/nation-client', () => ({
  nationClient: {
    sendMessage: jest.fn(),
  },
}));

jest.mock('@/lib/rate-limiter', () => ({
  rateLimit: jest.fn().mockResolvedValue({ success: true }),
}));

describe('/api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for invalid input (empty message)', async () => {
    const request = {
      method: 'POST',
      json: async () => ({ message: '' }),
      headers: { get: () => 'unknown' },
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request');
  });

  it('should return 429 when rate limit is exceeded', async () => {
    (rateLimit as jest.Mock).mockResolvedValueOnce({ success: false });

    const request = {
      method: 'POST',
      json: async () => ({ message: 'Hello' }),
      headers: { get: () => 'test-ip' },
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBe('Rate limit exceeded. Try again later.');
  });

  it('should process a valid chat message and return 200', async () => {
    const mockApiResponse = { message: 'AI response', messageId: '123' };
    (nationClient.sendMessage as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    const request = {
      method: 'POST',
      json: async () => ({ message: 'Hello, AI!' }),
      headers: { get: () => 'test-ip' },
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockApiResponse);
    expect(nationClient.sendMessage).toHaveBeenCalledWith({
      message: 'Hello, AI!',
      context: undefined,
    });
  });

  it('should return 500 on internal server error', async () => {
    (nationClient.sendMessage as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    const request = {
      method: 'POST',
      json: async () => ({ message: 'Hello, AI!' }),
      headers: { get: () => 'test-ip' },
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Internal server error');
  });
});
