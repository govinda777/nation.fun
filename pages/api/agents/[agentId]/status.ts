/**
 * API Endpoint: Status do Agente
 * GET /api/agents/[agentId]/status
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { runningAgents } from './start';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { agentId } = req.query;

  try {
    if (!agentId || typeof agentId !== 'string') {
      return res.status(400).json({ error: 'agentId inválido' });
    }

    const agent = runningAgents.get(agentId);
    
    if (!agent) {
      return res.status(200).json({
        agentId,
        isRunning: false,
        status: 'stopped'
      });
    }

    const status = agent.getStatus();

    res.status(200).json({
      agentId,
      isRunning: status.isRunning,
      channelType: status.channelType,
      status: 'running'
    });
  } catch (error) {
    console.error('❌ Erro ao buscar status:', error);
    
    res.status(500).json({ 
      error: 'Erro ao buscar status',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
