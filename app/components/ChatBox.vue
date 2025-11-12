<!-- components/ChatBox.vue -->
<template>
  <div id="chat-container">
    <div id="chat-messages" ref="messagesEl">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['message', `${msg.role}-message`]"
      >
        {{ msg.content }}
      </div>
    </div>

    <div id="chat-input">
      <input
        v-model="input"
        @keydown.enter="sendMessage"
        type="text"
        id="message-input"
        placeholder="Type your message..."
      />
      <button @click="sendMessage" id="send-button">Send</button>
      <button @click="sendTestWhatsApp" id="test-whatsapp-button">
        Test WhatsApp
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const messages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([])
const input = ref('')
const messagesEl = ref<HTMLElement | null>(null)

const { sendMessage, sendTestWhatsApp } = useChat(messages, input, messagesEl)
</script>

<style scoped>
#chat-container {
  width: 400px;
  height: 600px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

#chat-messages {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  border-bottom: 1px solid #ccc;
}

#chat-input {
  display: flex;
  padding: 10px;
  gap: 8px;
}

#message-input {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-size: 1em;
}

#send-button,
#test-whatsapp-button {
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9em;
}

#test-whatsapp-button {
  background-color: #25d366;
}

.message {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
}

.user-message {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
  margin-left: auto;
}

.assistant-message {
  background-color: #e9e9eb;
  color: black;
  align-self: flex-start;
}
</style>