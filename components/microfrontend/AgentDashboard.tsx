import React, { useState, useEffect } from 'react';
import { AgentDashboardProps } from '@/types/module-federation';

/**
 * AgentDashboard Component
 *
 * Main dashboard for managing AI agents. This component is exposed via Module Federation
 * and can be consumed by host applications (e.g., Xperience).
 *
 * @param {string} userId - Authenticated user's unique identifier
 * @param {'light' | 'dark'} theme - Visual theme preference
 * @param {Function} onAgentCreate - Callback when a new agent is created
 * @param {Function} onError - Error handler callback
 *
 * @example
 * ```tsx
 * <AgentDashboard
 *   userId="user123"
 *   theme="dark"
 *   onAgentCreate={(id) => console.log('Created:', id)}
 * />
 * ```
 */
const AgentDashboard: React.FC<AgentDashboardProps> = ({
  userId,
  theme = 'light',
  onAgentCreate,
  onError,
}) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAgents();
  }, [userId]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      const response = await fetch(`/api/agents?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to load agents');
      }

      const data = await response.json();
      setAgents(data.agents || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    try {
      // TODO: Implement agent creation
      const newAgentId = 'agent_' + Date.now();
      onAgentCreate?.(newAgentId);
      await loadAgents();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create agent');
      setError(error);
      onError?.(error);
    }
  };

  if (loading) {
    return (
      <div className={`agent-dashboard agent-dashboard--${theme}`}>
        <div className="agent-dashboard__loading">
          <div className="spinner" />
          <p>Loading agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`agent-dashboard agent-dashboard--${theme}`}>
        <div className="agent-dashboard__error">
          <h2>Error Loading Dashboard</h2>
          <p>{error.message}</p>
          <button onClick={loadAgents}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`agent-dashboard agent-dashboard--${theme}`}>
      <header className="agent-dashboard__header">
        <h1>AI Agents Dashboard</h1>
        <button
          className="agent-dashboard__create-btn"
          onClick={handleCreateAgent}
        >
          + Create New Agent
        </button>
      </header>

      <div className="agent-dashboard__content">
        {agents.length === 0 ? (
          <div className="agent-dashboard__empty">
            <p>No agents yet. Create your first AI agent!</p>
          </div>
        ) : (
          <div className="agent-dashboard__grid">
            {agents.map((agent: any) => (
              <div key={agent.id} className="agent-card">
                <h3>{agent.name}</h3>
                <p>{agent.description}</p>
                <span className="agent-card__status">{agent.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .agent-dashboard {
          width: 100%;
          min-height: 400px;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .agent-dashboard--light {
          background: #ffffff;
          color: #000000;
        }

        .agent-dashboard--dark {
          background: #1a1a1a;
          color: #ffffff;
        }

        .agent-dashboard__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .agent-dashboard__create-btn {
          padding: 12px 24px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }

        .agent-dashboard__create-btn:hover {
          background: #0051cc;
        }

        .agent-dashboard__loading,
        .agent-dashboard__error,
        .agent-dashboard__empty {
          text-align: center;
          padding: 48px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top-color: #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .agent-dashboard__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .agent-card {
          padding: 24px;
          border: 1px solid #eaeaea;
          border-radius: 12px;
          transition: transform 0.2s;
        }

        .agent-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .agent-dashboard--dark .agent-card {
          border-color: #333;
        }

        .agent-card__status {
          display: inline-block;
          padding: 4px 12px;
          background: #10b981;
          color: white;
          border-radius: 12px;
          font-size: 12px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};

export default AgentDashboard;
