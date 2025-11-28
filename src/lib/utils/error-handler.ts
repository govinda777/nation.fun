// src/lib/utils/error-handler.ts

import logger from './logger';

/**
 * Classe de erro customizada para exceções específicas do bot.
 * Permite associar um código de erro e um status HTTP para respostas de API.
 */
export class BotError extends Error {
  /**
   * @param code - Um código de erro único para a falha (ex: 'TWITTER_API_ERROR').
   * @param statusCode - O status HTTP a ser retornado em respostas de API.
   * @param message - A mensagem de erro descritiva.
   */
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'BotError';
  }
}

/**
 * Centraliza o tratamento de erros da aplicação.
 *
 * Esta função recebe um erro desconhecido, faz o log apropriado
 * e retorna uma estrutura de erro padronizada para ser enviada
 * como resposta de uma API.
 *
 * @param error - O erro capturado (pode ser de qualquer tipo).
 * @returns Um objeto com o status HTTP e a mensagem de erro.
 */
export function handleError(error: unknown): { status: number; message: string } {
  if (error instanceof BotError) {
    logger.warn({ err: error }, `BotError: [${error.code}] ${error.message}`);
    return { status: error.statusCode, message: error.message };
  }

  if (error instanceof Error) {
    logger.error({ err: error }, `Unhandled Error: ${error.message}`);
    return { status: 500, message: 'Ocorreu um erro inesperado.' };
  }

  logger.error({ error }, 'Unhandled error of unknown type.');
  return { status: 500, message: 'Ocorreu um erro desconhecido.' };
}
