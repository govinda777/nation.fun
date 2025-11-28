// pages/api/bot/twitter/start.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import NationAgentClient from '@/src/lib/agents/nation-client';
import TwitterAgentListener from '@/src/lib/agents/twitter-agent';
import logger from '@/src/lib/utils/logger';
import { BotError, handleError } from '@/src/lib/utils/error-handler';

// Usamos uma variável global para garantir que o bot seja um singleton e não seja recriado a cada chamada em dev.
// Em um ambiente de produção real, isso seria gerenciado por um processo de inicialização de servidor.
declare global {
  var twitterBot: TwitterAgentListener | undefined;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    if (global.twitterBot) {
      logger.warn('O bot do Twitter já está em execução.');
      return res.status(200).json({ message: 'Bot já está em execução.' });
    }

    const {
      NATION_API_KEY,
      NATION_AGENT_ID,
      TWITTER_API_KEY,
      TWITTER_API_SECRET
    } = process.env;

    if (!NATION_API_KEY || !NATION_AGENT_ID || !TWITTER_API_KEY || !TWITTER_API_SECRET) {
      throw new BotError('MISSING_ENV_VARS', 500, 'Variáveis de ambiente essenciais não estão configuradas.');
    }

    const nationClient = new NationAgentClient(NATION_API_KEY, NATION_AGENT_ID);
    const twitterBot = new TwitterAgentListener(TWITTER_API_KEY, TWITTER_API_SECRET, nationClient);

    const checkInterval = parseInt(process.env.BOT_CHECK_INTERVAL || '60', 10);
    twitterBot.runContinuously(checkInterval);

    global.twitterBot = twitterBot;

    logger.info('Bot do Twitter iniciado com sucesso.');
    res.status(200).json({ message: 'Bot do Twitter iniciado com sucesso.' });

  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ error: message });
  }
}
