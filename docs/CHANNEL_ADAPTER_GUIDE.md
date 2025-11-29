# Guia de Implementação: Channel Adapter Pattern

## 🎯 Objetivo

Este guia mostra como adicionar um novo canal (Telegram, WhatsApp, Slack, etc.) à plataforma **nation.fun** usando o padrão Channel Adapter.

## 📚 Índice

1. [Visão Geral](#visão-geral)
2. [Passo a Passo](#passo-a-passo)
3. [Exemplo: Telegram](#exemplo-telegram)
4. [Testes](#testes)
5. [FAQ](#faq)

---

## Visão Geral

### Por que Channel Adapter?

✅ **DRY**: Lógica do agente escrita uma vez  
✅ **SOLID**: Cada adapter é independente e substituível  
✅ **Testável**: Mocks fáceis para cada canal  
✅ **Extensível**: Novo canal = novo adapter, zero impacto no core

### Arquitetura

```
ChannelAdapter (Interface)
    ↑
    │ implementa
    │
[TwitterAdapter] [TelegramAdapter] [WhatsAppAdapter]
    │
    │ usa
    ↓
AgentEngine (Core)
    │
    ↓
Nation.fun API
```

---

## Passo a Passo

### 1️⃣ Implementar o Adapter

Crie `src/lib/channels/telegram-adapter.ts`:

```typescript
import { ChannelAdapter, Message } from './base-channel-adapter';
import TelegramBot from 'node-telegram-bot-api';

export class TelegramAdapter implements ChannelAdapter {
  readonly channelType = 'telegram' as const;
  private bot: TelegramBot;
  private callback: ((message: Message) => Promise<void>) | null = null;

  constructor(botToken: string) {
    this.bot = new TelegramBot(botToken, { polling: true });
  }

  async listen(callback: (message: Message) => Promise<void>): Promise<void> {
    this.callback = callback;
    
    this.bot.on('message', async (msg) => {
      if (!msg.text) return;

      const message: Message = {
        id: msg.message_id.toString(),
        text: msg.text,
        sender: {
          id: msg.from?.id.toString() || 'unknown',
          name: msg.from?.first_name || 'Telegram User',
        },
        timestamp: new Date(msg.date * 1000),
      };

      if (this.callback) {
        await this.callback(message);
      }
    });
  }

  async send(recipientId: string, text: string): Promise<void> {
    await this.bot.sendMessage(recipientId, text);
  }

  async start(): Promise<void> {
    console.log('✅ Telegram bot iniciado');
  }

  async stop(): Promise<void> {
    await this.bot.stopPolling();
  }
}
```

### 2️⃣ Adicionar ao Factory

Edite `src/lib/core/agent-factory.ts`:

```typescript
import { TelegramAdapter } from '../channels/telegram-adapter';

// No método createAdapter:
case 'telegram':
  if (!credentials.botToken) {
    throw new Error('Telegram: botToken é obrigatório');
  }
  return new TelegramAdapter(credentials.botToken);
```

### 3️⃣ Atualizar Type

Em `base-channel-adapter.ts`, adicione ao union type:

```typescript
readonly channelType: 'whatsapp' | 'twitter' | 'telegram';
```

### 4️⃣ Testar

Curl de teste:

```bash
curl -X POST http://localhost:3000/api/agents/my-bot/start \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "my-bot",
    "nationApiKey": "sua-chave",
    "channelType": "telegram",
    "channelCredentials": {
      "botToken": "seu-bot-token"
    }
  }'
```

---

## Exemplo: Telegram

### Instalar Dependência

```bash
npm install node-telegram-bot-api
npm install --save-dev @types/node-telegram-bot-api
```

### Criar Adapter Completo

Veja exemplo completo no Passo 1 acima.

### Features Avançadas

**Comandos:**

```typescript
this.bot.onText(/\/start/, (msg) => {
  this.bot.sendMessage(msg.chat.id, 'Bem-vindo ao bot Nation.fun!');
});
```

**Botões Inline:**

```typescript
const opts = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Opção 1', callback_data: 'opt1' }],
      [{ text: 'Opção 2', callback_data: 'opt2' }]
    ]
  }
};
await this.bot.sendMessage(recipientId, 'Escolha:', opts);
```

---

## Testes

### Teste Unitário

```typescript
import { TelegramAdapter } from '@/src/lib/channels/telegram-adapter';

describe('TelegramAdapter', () => {
  let adapter: TelegramAdapter;

  beforeEach(() => {
    adapter = new TelegramAdapter('test-token');
  });

  it('should implement ChannelAdapter interface', () => {
    expect(adapter.channelType).toBe('telegram');
    expect(adapter.listen).toBeDefined();
    expect(adapter.send).toBeDefined();
  });
});
```

### Teste de Integração

```typescript
it('should send and receive messages', async () => {
  const adapter = new TelegramAdapter(process.env.TELEGRAM_BOT_TOKEN!);
  
  const receivedMessages: Message[] = [];
  await adapter.listen(async (msg) => {
    receivedMessages.push(msg);
  });
  
  await adapter.start();
  
  // Enviar mensagem de teste
  await adapter.send('test-chat-id', 'Hello!');
  
  // Aguardar resposta
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  expect(receivedMessages.length).toBeGreaterThan(0);
  
  await adapter.stop();
});
```

---

## FAQ

### Como adicionar Slack?

1. Instalar `@slack/bolt`
2. Criar `SlackAdapter` implementando `ChannelAdapter`
3. Usar Slack Events API para `listen()`
4. Usar `chat.postMessage` para `send()`

### Como lidar com mídia (imagens, vídeos)?

Expanda a interface `Message`:

```typescript
export interface Message {
  id: string;
  text: string;
  sender: { id: string; name: string; };
  timestamp: Date;
  attachments?: Array<{
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
  }>;
}
```

### Como usar webhooks em vez de polling?

No `start()`:

```typescript
async start(): Promise<void> {
  const app = express();
  app.post('/webhook', async (req, res) => {
    const message = this.parseWebhookPayload(req.body);
    if (this.callback) {
      await this.callback(message);
    }
    res.sendStatus(200);
  });
  app.listen(3001);
}
```

### Como adicionar autenticação?

Adicione validação no constructor:

```typescript
constructor(botToken: string) {
  if (!this.validateToken(botToken)) {
    throw new Error('Token inválido');
  }
  this.bot = new TelegramBot(botToken, { polling: true });
}

private validateToken(token: string): boolean {
  return /^\d+:[A-Za-z0-9_-]+$/.test(token);
}
```

---

## Próximos Passos

1. ✅ Implementar TelegramAdapter
2. ✅ Implementar WhatsAppAdapter
3. 🔴 Adicionar suporte a mídia
4. 🔴 Implementar webhooks
5. 🔴 Criar dashboard de monitoramento

---

**Dúvidas?** Abra uma issue no GitHub ou consulte a [documentação completa](../README-ARCHITECTURE.md).
