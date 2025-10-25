const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') {
        return;
    }

    addMessage(message, 'user');
    messageInput.value = '';

    fetch('https://open.service.crestal.network/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.NARION_TOKEN}`
        },
        body: JSON.stringify({
            model: 'intentkit-001',
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
