// services/agents/agent-orchestrator.js

class AgentOrchestrator {
  /**
   * Selects the appropriate agent and gets a response.
   * @param {string} message - The user's message.
   * @returns {Promise<string>} - The agent's response.
   */
  async getAgentResponse(message) {
    // For now, we'll just echo the message back.
    // In the future, this will involve more complex logic to select and query the appropriate agent.
    return `You said: ${message}`;
  }
}

export default new AgentOrchestrator();
