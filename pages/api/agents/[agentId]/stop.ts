/**
 * API Endpoint: Parar Agente
 * POST /api/agents/[agentId]/stop
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { runningAgents } from './start';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { agentId } = req.query;

  try {
    if (!agentId || typeof agentId !== 'string') {
      return res.status(400).json({ error: 'agentId inválido' });
    }

    const agent = runningAgents.get(agentId);
    
    if (!agent) {
      return res.status(404).json({ 
        error: 'Agente não encontrado ou não está rodando',
        agentId
      });
    }

    console.log(`⏹️  Parando agente ${agentId}...`);
    
    await agent.stop();
    runningAgents.delete(agentId);

    res.status(200).json({
      success: true,
      message: `Agente ${agentId} parado com sucesso`,
      agentId
    });
  } catch (error) {
    console.error('❌ Erro ao parar agente:', error);
    
    res.status(500).json({ 
      error: 'Erro ao parar agente',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
