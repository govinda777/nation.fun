import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limiter';
import { nationClient } from '@/lib/nation-client';
import { logger } from '@/lib/logger';

// Schema de validação
const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  context: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip);

    if (!rateLimitResult.success) {
      logger.warn('Rate limit exceeded', { ip });
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }

    // 2. Validação do Input
    const body = await request.json();
    const validation = chatSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('Validation failed', { errors: validation.error });
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error },
        { status: 400 }
      );
    }

    const { message, context } = validation.data;

    // 3. Sanitização
    const sanitizedMessage = message.trim();

    // 4. Chamada à Nation API (backend-to-backend)
    logger.info('Processing chat request', { messageLength: message.length });

    const response = await nationClient.sendMessage({
      message: sanitizedMessage,
      context,
    });

    // 5. Audit Log
    logger.info('Chat request completed', {
      duration: Date.now() - startTime,
      success: true,
    });

    // 6. Resposta Segura (SEM TOKEN)
    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Chat API error', { error });

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
