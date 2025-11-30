// app/api/agents/[agentId]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runningAgents } from '@/lib/agent-manager';

export async function GET(
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
      return NextResponse.json({
        agentId,
        isRunning: false,
        status: 'stopped'
      });
    }

    const status = agent.getStatus();

    return NextResponse.json({
      agentId,
      isRunning: status.isRunning,
      channelType: status.channelType,
      status: 'running'
    });
  } catch (error) {
    console.error('❌ Erro ao buscar status:', error);

    return NextResponse.json(
      {
        error: 'Erro ao buscar status',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
