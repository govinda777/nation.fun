// features/step_definitions/twitter_agent_steps.ts

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import assert from 'assert';
import nock from 'nock';
import sinon from 'sinon';
import { TwitterApi } from 'twitter-api-v2';
// Caminhos ajustados para funcionar após a compilação para dist-test
import NationAgentClient from '../../src/lib/agents/nation-client';
import TwitterAgentListener from '../../src/lib/agents/twitter-agent';

// -- Contexto compartilhado entre os steps --
Before(function (this: any) {
  this.mocks = {};
  this.spies = {};
  nock.disableNetConnect();
});

After(function (this: any) {
  nock.cleanAll();
  nock.enableNetConnect();
  if (this.spies.replySpy) this.spies.replySpy.restore();
});

// -- Step Definitions --

Given('que a API do Twitter retornará uma nova menção com o texto {string}', function (this: any, tweetText: string) {
  nock('https://api.twitter.com').get('/2/users/me').reply(200, { data: { id: 'bot123' } });

  const mentionsResponse = {
    data: {
      meta: { result_count: 1, newest_id: 'tweet2' },
      data: [{ id: 'tweet1', text: `@Bot ${tweetText}`, author_id: 'user456' }],
    }
  };
  this.mocks.twitterMentions = nock('https://api.twitter.com')
    .get(`/2/users/bot123/timelines/mentions`)
    .query(true)
    .reply(200, mentionsResponse);

  const twitterV2Client = new TwitterApi().v2;
  this.spies.replySpy = sinon.spy(twitterV2Client, 'reply');
});

Given('a API do Nation.fun responderá à mensagem {string} com {string}', function (this: any, inputText: string, responseText: string) {
  this.mocks.nationApi = nock('https://api.nation.fun/v1')
    .post('/chat', (body: any) => body.message === inputText)
    .reply(200, { response: responseText });
});

When('o bot verificar por novas menções no Twitter', async function (this: any) {
  const mockDelay = async () => Promise.resolve();
  const nationClient = new NationAgentClient('test-key', 'test-agent-id', 'https://api.nation.fun/v1', mockDelay);
  const twitterListener = new TwitterAgentListener('test-key', 'test-secret', nationClient);

  await twitterListener.processMentions();
});

Then('a API do Twitter deverá ter sido chamada para postar a resposta {string}', function (this: any, expectedReply: string) {
  assert(this.spies.replySpy.calledOnce, 'A função de resposta do Twitter não foi chamada.');
  assert.strictEqual(this.spies.replySpy.firstCall.args[0], expectedReply, `A resposta esperada era "${expectedReply}".`);
});
