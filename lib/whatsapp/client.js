// services/whatsapp/client.js
import axios from 'axios';

class WhatsAppClient {
  constructor() {
    this.baseURL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}`;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(to, message) {
    try {
      const response = await this.axiosInstance.post('/messages', {
        messaging_product: 'whatsapp',
        to: to,
        text: { body: message },
      });
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response.data);
      throw new Error('Failed to send WhatsApp message');
    }
  }
}

export default new WhatsAppClient();
