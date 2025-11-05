import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);


    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: input }],
      }),
    });
    setInput('');
    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
  };

  const sendTestWhatsAppMessage = async () => {
    fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            entry: [{
                changes: [{
                    value: {
                        messages: [{
                            from: '1234567890',
                            text: {
                                body: 'Olá, preciso de ajuda'
                            },
                            type: 'text'
                        }]
                    }
                }]
            }]
        })
    })
  };

  return (
    <div>
      <Head>
        <title>Nation Agent</title>
      </Head>
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
            id="message-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button id="send-button" onClick={sendMessage}>
            Send
          </button>
          <button id="test-whatsapp-button" onClick={sendTestWhatsAppMessage}>
            Test WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
