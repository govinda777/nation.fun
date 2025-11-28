// src/lib/agents/twitter-agent.ts

import { TwitterApi, TweetV2 } from 'twitter-api-v2';
import cron, { ScheduledTask } from 'node-cron';
import NationAgentClient from './nation-client';
import logger from '../utils/logger';
import { BotError } from '../utils/error-handler';
import { Tweet } from './types';

class TwitterAgentListener {
  private twitterClient: TwitterApi;
  private nationClient: NationAgentClient;
  private lastSeenId: string | undefined;
  private cronJob: ScheduledTask | null = null;
  private twitterUserId: string | undefined;

  constructor(
    twitterApiKey: string,
    twitterApiSecret: string,
    nationClient: NationAgentClient
  ) {
    if (!twitterApiKey || !twitterApiSecret) {
      throw new Error('As credenciais da API do Twitter são obrigatórias.');
    }
    this.twitterClient = new TwitterApi({
        appKey: twitterApiKey,
        appSecret: twitterApiSecret,
    });
    this.nationClient = nationClient;
  }

  public async processMentions(): Promise<void> {
    try {
      if (!this.twitterUserId) {
        const me = await this.twitterClient.v2.me();
        this.twitterUserId = me.data.id;
        logger.info(`Twitter User ID: ${this.twitterUserId}`);
      }

      logger.info('Buscando menções...');
      // A forma correta de buscar menções é através da timeline do usuário
      const mentions = await this.twitterClient.v2.userTimeline(this.twitterUserId, {
        since_id: this.lastSeenId,
        'tweet.fields': ['author_id'],
        exclude: ['replies', 'retweets'],
      });

      if (!mentions.data.meta.result_count) {
        logger.info('Nenhuma nova menção encontrada.');
        return;
      }

      const newLastSeenId = mentions.data.meta.newest_id;
      if (newLastSeenId) {
        this.lastSeenId = newLastSeenId;
      }

      for (const mention of mentions.data.data) {
        if (mention.author_id === this.twitterUserId) continue;

        await this.handleMention(mention);
      }
    } catch (error) {
      throw new BotError('TWITTER_API_ERROR', 500, `Falha ao buscar menções: ${error}`);
    }
  }

  private async handleMention(mention: TweetV2): Promise<void> {
    try {
      logger.info({ tweetId: mention.id, text: mention.text }, 'Processando menção.');

      const messageText = mention.text.replace(/@\w+\s*/, '').trim();

      if (!messageText) {
        logger.warn({ tweetId: mention.id }, 'Menção sem texto. Ignorando.');
        return;
      }

      const agentResponse = await this.nationClient.sendMessage(messageText);

      const replyText = this.truncateTweet(agentResponse.response);

      const rwClient = new TwitterApi({
          appKey: process.env.TWITTER_API_KEY!,
          appSecret: process.env.TWITTER_API_SECRET!,
          accessToken: process.env.TWITTER_ACCESS_TOKEN!,
          accessSecret: process.env.TWITTER_ACCESS_SECRET!,
      });

      await rwClient.v2.reply(replyText, mention.id);

      logger.info({ tweetId: mention.id, reply: replyText }, 'Resposta enviada com sucesso.');
    } catch (error) {
        logger.error({ err: error, tweetId: mention.id }, 'Falha ao processar menção.');
    }
  }

  public runContinuously(intervalSeconds: number = 60): void {
    if (this.cronJob) {
      logger.warn('O bot já está em execução.');
      return;
    }

    logger.info(`Iniciando o bot para verificar menções a cada ${intervalSeconds} segundos.`);
    this.cronJob = cron.schedule(`*/${intervalSeconds} * * * * *`, () => {
      this.processMentions().catch(error => {
        logger.error({ err: error }, 'Erro durante a execução agendada do processMentions.');
      });
    });

    this.cronJob.start();
  }

  public stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      logger.info('Bot parado.');
    }
  }

  private truncateTweet(text: string): string {
    return text.length > 280 ? text.substring(0, 277) + '...' : text;
  }
}

export default TwitterAgentListener;
