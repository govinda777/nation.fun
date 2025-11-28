// __tests__/unit/agents/twitter-agent.test.ts

import TwitterAgentListener from '../../../src/lib/agents/twitter-agent';
import NationAgentClient from '../../../src/lib/agents/nation-client';

// Mock preciso da estrutura, agora com userTimeline
const mockTwitterV2Client = {
  me: jest.fn(),
  userTimeline: jest.fn(), // Corrigido
  reply: jest.fn(),
};
const mockTwitterApiInstance = {
  v2: mockTwitterV2Client,
};
jest.mock('twitter-api-v2', () => ({
  TwitterApi: jest.fn(() => mockTwitterApiInstance),
}));

jest.mock('../../../src/lib/agents/nation-client');

describe('TwitterAgentListener', () => {
  let nationClientMock: jest.Mocked<NationAgentClient>;
  let listener: TwitterAgentListener;

  beforeEach(() => {
    jest.clearAllMocks();

    nationClientMock = new (NationAgentClient as jest.Mock<NationAgentClient>)('key', 'id') as jest.Mocked<NationAgentClient>;
    listener = new TwitterAgentListener('key', 'secret', nationClientMock);

    mockTwitterV2Client.me.mockResolvedValue({ data: { id: 'bot123', name: 'Bot', username: 'Bot' } });
  });

  it('deve processar novas menções e responder', async () => {
    const timelineResponse = {
      data: {
        meta: { result_count: 1, newest_id: 'tweet2' },
        data: [{ id: 'tweet1', text: '@Bot Olá', author_id: 'user456' }],
      },
    };
    mockTwitterV2Client.userTimeline.mockResolvedValue(timelineResponse);

    nationClientMock.sendMessage.mockResolvedValue({
      response: 'Olá, mundo!',
    } as any);

    await listener.processMentions();

    expect(mockTwitterV2Client.userTimeline).toHaveBeenCalled();
    expect(nationClientMock.sendMessage).toHaveBeenCalledWith('Olá');
    expect(mockTwitterV2Client.reply).toHaveBeenCalledWith('Olá, mundo!', 'tweet1');
  });

  it('não deve fazer nada se não houver novas menções', async () => {
    const timelineResponse = {
      data: { meta: { result_count: 0 } },
    };
    mockTwitterV2Client.userTimeline.mockResolvedValue(timelineResponse);

    await listener.processMentions();

    expect(nationClientMock.sendMessage).not.toHaveBeenCalled();
    expect(mockTwitterV2Client.reply).not.toHaveBeenCalled();
  });

  it('deve truncar respostas com mais de 280 caracteres', async () => {
      const longResponse = 'a'.repeat(300);
      const truncatedResponse = 'a'.repeat(277) + '...';

      const timelineResponse = {
          data: {
              meta: { result_count: 1, newest_id: 'tweet3' },
              data: [{ id: 'tweet3', text: '@Bot texto longo', author_id: 'user789' }],
          },
      };
      mockTwitterV2Client.userTimeline.mockResolvedValue(timelineResponse);

      nationClientMock.sendMessage.mockResolvedValue({ response: longResponse } as any);

      await listener.processMentions();

      expect(mockTwitterV2Client.reply).toHaveBeenCalledWith(truncatedResponse, 'tweet3');
  });
});
