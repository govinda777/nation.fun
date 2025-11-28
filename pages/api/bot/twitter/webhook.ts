// pages/api/bot/twitter/webhook.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import logger from '../../../../src/lib/utils/logger';
import { handleError } from '../../../../src/lib/utils/error-handler';

/**
 * Endpoint para receber webhooks do Twitter.
 *
 * **Nota:** Atualmente, este endpoint serve como um placeholder. A lógica
 * principal do bot opera via polling (buscando menções periodicamente)
 * para simplificar a implantação. Uma implementação completa de webhook
 * exigiria a validação da assinatura do Twitter.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      logger.info({ body: req.body }, 'Webhook do Twitter recebido.');
      // TODO: Implementar a validação da assinatura do Twitter para segurança.
      // TODO: Acionar o processamento da menção (ex: via uma fila ou diretamente).
      res.status(200).json({ ok: true, message: 'Webhook received.' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ error: message });
  }
}
