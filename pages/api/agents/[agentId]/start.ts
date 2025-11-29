/**
 * API Endpoint: Iniciar Agente
 * POST /api/agents/[agentId]/start
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { AgentFactory, AgentConfig } from '@/src/lib/core/agent-factory';
import { AgentEngine } from '@/src/lib/core/agent-engine';

// Storage em memória (TODO: trocar por DB)
const runningAgents = new Map<string, AgentEngine>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { agentId } = req.query;
  const config: AgentConfig = req.body;

  try {
    // Validação básica
    if (!agentId || typeof agentId !== 'string') {
      return res.status(400).json({ error: 'agentId inválido' });
    }

    // Verifica se agente já está rodando
    if (runningAgents.has(agentId)) {
      return res.status(400).json({ 
        error: 'Agente já está rodando',
        agentId,
        channel: runningAgents.get(agentId)?.getStatus().channelType
      });
    }

    // Cria e inicializa agente
    console.log(`🚀 Iniciando agente ${agentId} no canal ${config.channelType}...`);
    
    const agent = AgentFactory.createAgent(config);
    await agent.initialize();
    
    // Salva referência
    runningAgents.set(agentId, agent);

    res.status(200).json({
      success: true,
      message: `Agente ${agentId} iniciado com sucesso`,
      agentId,
      channel: config.channelType,
      status: agent.getStatus()
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar agente:', error);
    
    res.status(500).json({ 
      error: 'Erro ao iniciar agente',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// Export para uso em testes
export { runningAgents };
