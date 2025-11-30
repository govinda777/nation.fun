'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';

export default function ChatWidget({ initialMessage }: { initialMessage?: string }) {
  const { messages, isLoading, error, sendMessage } = useChat();
  const [input, setInput] = useState('');

  // Lógica para a mensagem inicial foi removida para simplificar e corrigir o erro.
  // A prop initialMessage pode ser usada para popular o input inicial, se desejado.
  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput('');
  };

  return (
    <div id="chat-container">
      <div id="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}-message`}>
            {msg.content}
          </div>
        ))}
        {isLoading && <div className="message assistant-message">Pensando...</div>}
      </div>
      {error && <div className="error-message">{error}</div>}
      <div id="chat-input">
        <input
          type="text"
          placeholder="Fale com nosso agente..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
