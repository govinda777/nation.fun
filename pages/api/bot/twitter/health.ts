// pages/api/bot/twitter/health.ts

import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Endpoint de verificação de saúde (health check).
 *
 * Retorna um status 200 OK para indicar que o serviço está no ar e operacional.
 * Essencial para monitoramento automatizado e CI/CD.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    res.status(200).json({ status: 'ok' });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
