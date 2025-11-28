import { ComponentType } from 'react';

export interface AgentDashboardProps {
  userId?: string;
  theme?: 'light' | 'dark';
  onAgentCreate?: (agentId: string) => void;
  onError?: (error: Error) => void;
}

export interface AgentListProps {
  userId?: string;
  maxItems?: number;
}
