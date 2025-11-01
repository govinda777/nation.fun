const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const testWhatsAppButton = document.getElementById('test-whatsapp-button');

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
testWhatsAppButton.addEventListener('click', sendTestWhatsAppMessage);

function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') {
        return;
    }

    addMessage(message, 'user');
    messageInput.value = '';

    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [{
                role: 'user',
                content: message
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        const assistantMessage = data.choices[0].message.content;
        addMessage(assistantMessage, 'assistant');
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage('Sorry, something went wrong.', 'assistant');
    });
}

function addMessage(message, role) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${role}-message`);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendTestWhatsAppMessage() {
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
    .then(response => {
        if (response.ok) {
            addMessage('Test message sent to WhatsApp API.', 'assistant');
        } else {
            addMessage('Failed to send test message to WhatsApp API.', 'assistant');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage('Sorry, something went wrong.', 'assistant');
    });
}
