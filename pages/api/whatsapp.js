// pages/api/whatsapp.js
import webhookHandler from './webhook-handler.js';
import { processWhatsAppMessage } from './message-processor.js';

/**
 * @swagger
 * /api/whatsapp:
 *   post:
 *     summary: Handles incoming WhatsApp webhooks
 *     description: Validates, processes, and responds to WhatsApp messages.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entry:
 *                 type: array
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Validação do webhook
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).end();
    }
  } else if (req.method === 'POST') {
    try {
      // Validar assinatura do webhook
      if (!webhookHandler.validateWhatsAppWebhook(req)) {
        return res.status(401).send('Unauthorized');
      }

      // Processar a mensagem
      await processWhatsAppMessage(req.body);

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing WhatsApp webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
