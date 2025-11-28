// src/lib/utils/logger.ts

import pino from 'pino';

/**
 * Logger estruturado para a aplicação.
 *
 * O nível do log pode ser configurado através da variável de ambiente `BOT_LOG_LEVEL`.
 * Em ambiente de desenvolvimento, utiliza o transporte 'pino-pretty' para logs mais legíveis.
 */
const logger = pino({
  level: process.env.BOT_LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
});

export default logger;
