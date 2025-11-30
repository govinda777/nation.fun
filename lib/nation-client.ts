import axios, { AxiosInstance } from 'axios';
import { logger } from './logger';

class NationClient {
  private client: AxiosInstance;
  private token: string;

  constructor() {
    // Token NUNCA é exposto ao frontend
    this.token = process.env.NATION_TOKEN || '';

    if (!this.token) {
      throw new Error('NATION_TOKEN not configured');
    }

    this.client = axios.create({
      baseURL: process.env.NATION_API_URL || 'https://api.nation.io',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token
    this.client.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${this.token}`;
      return config;
    });

    // Interceptor para logging
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('Nation API response', {
          status: response.status,
          url: response.config.url
        });
        return response;
      },
      (error) => {
        logger.error('Nation API error', {
          status: error.response?.status,
          message: error.message,
        });
        throw error;
      }
    );
  }

  async sendMessage(data: { message: string; context?: Record<string, unknown> }) {
    const response = await this.client.post('/chat', data);
    return response.data;
  }
}

// Singleton
export const nationClient = new NationClient();
