import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  // Mock data
  const allAgents = [
    {
      id: 'agent_1',
      name: 'Twitter Bot',
      description: 'Automated Twitter engagement agent',
      status: 'active',
      userId: 'user123',
    },
    {
      id: 'agent_2',
      name: 'Trading Agent',
      description: 'Crypto trading automation',
      status: 'active',
      userId: 'user123',
    },
    {
      id: 'agent_3',
      name: 'Generic Agent',
      description: 'A generic agent',
      status: 'inactive',
      userId: 'user456',
    },
  ];

  if (userId) {
    const userAgents = allAgents
      .filter((agent) => agent.userId === userId)
      .map((agent) => ({ ...agent }));
    return NextResponse.json({ agents: userAgents });
  }

  const publicAgents = allAgents.map((agent) => ({
    ...agent,
    userId: null,
  }));

  return NextResponse.json({ agents: publicAgents });
}
