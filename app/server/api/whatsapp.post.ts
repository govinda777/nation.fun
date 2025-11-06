// server/api/whatsapp.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Simula processamento do webhook do WhatsApp
  console.log('Webhook recebido:', JSON.stringify(body, null, 2))

  // Aqui você integraria com Twilio, Meta API, etc.
  // Por enquanto, só retorna sucesso

  return { success: true, message: 'Webhook simulado com sucesso' }
})