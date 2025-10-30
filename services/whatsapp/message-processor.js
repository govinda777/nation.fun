// services/whatsapp/message-processor.js
import whatsAppClient from './client';
import agentOrchestrator from '../agents/agent-orchestrator';

/**
 * Processes an incoming WhatsApp message from the webhook.
 * @param {object} payload - The webhook payload from WhatsApp.
 */
export async function processWhatsAppMessage(payload) {
  try {
    const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message?.type === 'text') {
      const from = message.from;
      const messageBody = message.text.body;

      // 1. Select the appropriate agent
      const agentResponse = await agentOrchestrator.getAgentResponse(messageBody);

      // 2. Send the response back to the user
      await whatsAppClient.sendMessage(from, agentResponse);
    }
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    // Optional: Send an error message back to the user
    // await whatsAppClient.sendMessage(from, "Sorry, I couldn't process your request.");
  }
}
