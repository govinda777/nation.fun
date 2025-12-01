// services/whatsapp/message-processor.js
import whatsAppClient from './client.js';
import agentOrchestrator from '@/lib/core/agent-orchestrator.js';

/**
 * Processes an incoming WhatsApp message from the webhook.
 * @param {object} payload - The webhook payload from WhatsApp.
 * @param {object} [dependencies] - Optional dependencies for testing.
 * @param {object} [dependencies.whatsAppClient] - The WhatsApp client.
 * @param {object} [dependencies.agentOrchestrator] - The agent orchestrator.
 */
export async function processWhatsAppMessage(payload, dependencies = {}) {
  const {
    whatsAppClient: whatsAppClientDep = whatsAppClient,
    agentOrchestrator: agentOrchestratorDep = agentOrchestrator,
  } = dependencies;

  try {
    const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message?.type === 'text') {
      const from = message.from;
      const messageBody = message.text.body;

      // 1. Select the appropriate agent
      const agentResponse = await agentOrchestratorDep.getAgentResponse(messageBody);

      // 2. Send the response back to the user
      await whatsAppClientDep.sendMessage(from, agentResponse);
    }
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    // Optional: Send an error message back to the user
    // await whatsAppClient.sendMessage(from, "Sorry, I couldn't process your request.");
  }
}