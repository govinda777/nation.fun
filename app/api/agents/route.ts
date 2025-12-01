// app/api/agents/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // Mock data - Em uma aplicação real, isso viria de um banco de dados
  const mockAgents = [
    {
      id: 'agent_1',
      name: 'Twitter Bot',
      description: 'Automated Twitter engagement agent',
      status: 'active',
      userId: userId, // Associando o agente ao userId da query
    },
    {
      id: 'agent_2',
      name: 'Trading Agent',
      description: 'Crypto trading automation',
      status: 'active',
      userId: userId,
    },
  ];

  return NextResponse.json({ agents: mockAgents });
}
