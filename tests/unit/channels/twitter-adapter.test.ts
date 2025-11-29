/**
 * Testes Unitários - Twitter Adapter
 */

import { TwitterAdapter } from '@/src/lib/channels/twitter-adapter';

describe('TwitterAdapter', () => {
  let adapter: TwitterAdapter;

  beforeEach(() => {
    adapter = new TwitterAdapter('test-key', 'test-secret');
  });

  afterEach(async () => {
    await adapter.stop();
  });

  describe('Interface Implementation', () => {
    it('should implement ChannelAdapter interface', () => {
      expect(adapter.channelType).toBe('twitter');
      expect(adapter.listen).toBeDefined();
      expect(adapter.send).toBeDefined();
      expect(adapter.start).toBeDefined();
      expect(adapter.stop).toBeDefined();
    });

    it('should have correct channelType', () => {
      expect(adapter.channelType).toBe('twitter');
    });
  });

  describe('listen()', () => {
    it('should register callback function', async () => {
      const callback = jest.fn();
      await adapter.listen(callback);
      // Callback registrado com sucesso
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('start() and stop()', () => {
    it('should start without errors', async () => {
      await expect(adapter.start()).resolves.not.toThrow();
    });

    it('should stop without errors', async () => {
      await adapter.start();
      await expect(adapter.stop()).resolves.not.toThrow();
    });

    it('should handle multiple start calls', async () => {
      await adapter.start();
      await adapter.start(); // Segunda chamada deve ser ignorada
      await adapter.stop();
    });
  });

  describe('send()', () => {
    it('should send message', async () => {
      // Mock mode - apenas verifica que não lança erro
      await expect(
        adapter.send('test-recipient', 'Hello Twitter!')
      ).resolves.not.toThrow();
    });
  });
});
