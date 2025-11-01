// services/whatsapp/webhook-handler.js
import crypto from 'crypto';

class WebhookHandler {
  validateWhatsAppWebhook(req) {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
      return false;
    }

    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET);
    hmac.update(payload);
    const expectedSignature = `sha256=${hmac.digest('hex')}`;

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }
}

export default new WebhookHandler();
