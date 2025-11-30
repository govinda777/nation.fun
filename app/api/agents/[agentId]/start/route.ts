// app/api/agents/[agentId]/start/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AgentFactory, AgentConfig } from '@/src/lib/core/agent-factory';
import { runningAgents } from '@/lib/agent-manager'; // Usando o manager centralizado

export async function POST(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  const { agentId } = params;
  const config: AgentConfig = await request.json();

  try {
    if (!agentId) {
      return NextResponse.json({ error: 'agentId inválido' }, { status: 400 });
    }

    if (runningAgents.has(agentId)) {
      const existingAgent = runningAgents.get(agentId)!;
      return NextResponse.json(
        {
          error: 'Agente já está rodando',
          agentId,
          channel: existingAgent.getStatus().channelType
        },
        { status: 400 }
      );
    }

    console.log(`🚀 Iniciando agente ${agentId} no canal ${config.channelType}...`);

    const agent = AgentFactory.createAgent(config);
    await agent.initialize();

    runningAgents.set(agentId, agent);

    return NextResponse.json({
      success: true,
      message: `Agente ${agentId} iniciado com sucesso`,
      agentId,
      channel: config.channelType,
      status: agent.getStatus()
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar agente:', error);

    return NextResponse.json(
      {
        error: 'Erro ao iniciar agente',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
