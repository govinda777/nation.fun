// composables/useChat.ts

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const useChat = (
  messages: Ref<Message[]>,
  input: Ref<string>,
  messagesEl: Ref<HTMLElement | null>
) => {
  const addMessage = (content: string, role: 'user' | 'assistant') => {
    messages.value.push({ role, content })
    nextTick(() => {
      if (messagesEl.value) {
        messagesEl.value.scrollTop = messagesEl.value.scrollHeight
      }
    })
  }

  const sendMessage = async () => {
    const message = input.value.trim()
    if (!message) return

    addMessage(message, 'user')
    input.value = ''

    try {
      // Chama sua própria API no servidor (segura!)
      const data = await $fetch('/api/chat', {
        method: 'POST',
        body: { message }
      })

      const assistantMessage = data.choices?.[0]?.message?.content || 'No response.'
      addMessage(assistantMessage, 'assistant')
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMsg = error.statusMessage || 'Sorry, something went wrong.'
      addMessage(errorMsg, 'assistant')
    }
  }

  const sendTestWhatsApp = async () => {
    try {
      await $fetch('/api/whatsapp', {
        method: 'POST',
        body: {
          entry: [{
            changes: [{
              value: {
                messages: [{
                  from: '1234567890',
                  text: { body: 'Olá, preciso de ajuda' },
                  type: 'text'
                }]
              }
            }]
          }]
        }
      })

      addMessage('Test message sent to WhatsApp API.', 'assistant')
    } catch (error) {
      console.error('Erro no teste WhatsApp:', error)
      addMessage('Failed to send test message.', 'assistant')
    }
  }

  return {
    sendMessage,
    sendTestWhatsApp
  }
}