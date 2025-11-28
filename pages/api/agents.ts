import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  // Mock data
  const mockAgents = [
    {
      id: 'agent_1',
      name: 'Twitter Bot',
      description: 'Automated Twitter engagement agent',
      status: 'active',
      userId: userId,
    },
    {
      id: 'agent_2',
      name: 'Trading Agent',
      description: 'Crypto trading automation',
      status: 'active',
      userId: userId,
    },
  ];

  res.status(200).json({ agents: mockAgents });
}
