// app/api/agents/[agentId]/stop/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runningAgents } from '@/lib/agent-manager';

export async function POST(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  const { agentId } = params;

  try {
    if (!agentId) {
      return NextResponse.json({ error: 'agentId inválido' }, { status: 400 });
    }

    const agent = runningAgents.get(agentId);

    if (!agent) {
      return NextResponse.json(
        {
          error: 'Agente não encontrado ou não está rodando',
          agentId
        },
        { status: 404 }
      );
    }

    console.log(`⏹️  Parando agente ${agentId}...`);

    await agent.stop();
    runningAgents.delete(agentId);

    return NextResponse.json({
      success: true,
      message: `Agente ${agentId} parado com sucesso`,
      agentId
    });
  } catch (error) {
    console.error('❌ Erro ao parar agente:', error);

    return NextResponse.json(
      {
        error: 'Erro ao parar agente',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
