// server/api/chat.ts
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { message } = await readBody(event)

  if (!message || typeof message !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Mensagem inválida' })
  }

  const TOKEN = useRuntimeConfig().nationToken

  try {
    const data: any = await $fetch('https://open.service.crestal.network/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: {
        model: 'intentkit-001',
        messages: [{ role: 'user', content: message }],
      },
    })

    // VALIDAÇÃO CRÍTICA: garanta que é JSON válido
    if (!data || typeof data !== 'object' || !data.choices?.[0]?.message?.content) {
      console.warn('Resposta inválida da API externa:', data)
      throw new Error('Resposta da IA inválida ou incompleta')
    }

    return {
      choices: data.choices,
    }
  } catch (err: any) {
    console.error('Erro na API de chat:', err)

    // Se for erro de rede ou HTML, trate como falha
    const isHtml = typeof err?.data === 'string' && err.data.includes('<html')
    const errorMsg = isHtml
      ? 'API retornou HTML (token inválido, bloqueio, etc)'
      : err.message || 'Falha ao comunicar com a IA'

    throw createError({
      statusCode: 502,
      statusMessage: errorMsg,
    })
  }
})