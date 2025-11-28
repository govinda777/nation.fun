import React from 'react';
import { AgentListProps } from '@/types/module-federation';

/**
 * AgentList Component (Placeholder)
 *
 * Lists AI agents for a given user. This is a placeholder component.
 *
 * @param {string} userId - Authenticated user's unique identifier
 * @param {number} maxItems - Maximum number of agents to display
 */
const AgentList: React.FC<AgentListProps> = ({ userId, maxItems = 5 }) => {
  return (
    <div className="agent-list">
      <h3>Your Agents</h3>
      <p>Listing agents for user: {userId}</p>
      <p>Maximum items: {maxItems}</p>
      {/* TODO: Implement full functionality later */}
    </div>
  );
};

export default AgentList;
