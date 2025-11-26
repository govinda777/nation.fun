import { useState, useEffect } from 'react';

export default function ChatWidget({ initialMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (initialMessage) {
      setMessages([{ role: 'assistant', content: initialMessage }]);
    }
  }, [initialMessage]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: input }] }),
    });

    setInput('');
    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
  };

  return (
    <div id="chat-container">
      <div id="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}-message`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div id="chat-input">
        <input
          type="text"
          placeholder="Fale com nosso agente..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
