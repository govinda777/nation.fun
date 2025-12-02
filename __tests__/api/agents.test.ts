/**
 * @jest-environment node
 */

import { GET } from '@/app/api/agents/route';
import { NextRequest } from 'next/server';

describe('GET /api/agents', () => {
  describe('quando userId é fornecido', () => {
    it('deve retornar lista de agentes associados ao userId', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/agents?userId=user123'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.agents).toHaveLength(2);
      expect(data.agents[0].userId).toBe('user123');
    });
  });

  describe('quando userId não é fornecido', () => {
    it('deve retornar agentes com userId null', async () => {
      const request = new NextRequest('http://localhost:3000/api/agents');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.agents).toBeDefined();
      expect(data.agents[0].userId).toBe(null);
    });
  });

  describe('validação de dados', () => {
    it('deve retornar agentes com estrutura correta', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/agents?userId=user123'
      );

      const response = await GET(request);
      const data = await response.json();

      data.agents.forEach((agent: any) => {
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('description');
        expect(agent).toHaveProperty('status');
      });
    });
  });
});
