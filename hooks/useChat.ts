import { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { ChatMessage } from '@/types/api';

export function useChat() {
  const { messages, isLoading, error, addMessage, setLoading, setError } = useChatStore();

  const sendMessage = async (content: string) => {
    try {
      setLoading(true);
      setError(null);

      // Adicionar mensagem do usuário
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      addMessage(userMessage);

      // Chamar API (SEM TOKEN)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      // Adicionar resposta do assistente
      const assistantMessage: ChatMessage = {
        id: data.data.messageId || crypto.randomUUID(),
        role: 'assistant',
        content: data.data.message,
        timestamp: new Date(),
      };
      addMessage(assistantMessage);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}
