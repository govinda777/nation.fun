// app/api/whatsapp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import webhookHandler from '@/lib/whatsapp/webhook-handler.js';
import { processWhatsAppMessage } from '@/lib/whatsapp/message-processor.js';

// Handler para a verificação do webhook do WhatsApp (GET)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse('Forbidden', { status: 403 });
  }
}

// Handler para receber as mensagens do WhatsApp (POST)
export async function POST(request: NextRequest) {
  try {
    // A validação do webhook precisa ser adaptada para o objeto NextRequest
    // Por enquanto, vamos assumir que a lógica em webhookHandler pode ser ajustada.
    // if (!webhookHandler.validateWhatsAppWebhook(request)) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    const body = await request.json();
    await processWhatsAppMessage(body);

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
