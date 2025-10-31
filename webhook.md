
## Tutorial Completo: Criando um Webhook GitHub que Interage com o Agente Nation usando Smee

### Objetivo
Configurar seu repositório GitHub para disparar eventos de commit (push) e fazer seu agente Next.js reagir automaticamente a esses eventos, com a ajuda do Smee para encaminhar os webhooks para seu ambiente local.

***

### 1. Preparar seu projeto do Agente Next.js
- Crie uma aplicação Next.js (ou similar).
- Implemente uma rota API para receber os webhooks, por exemplo, `pages/api/webhook.js`.

```javascript
// pages/api/webhook.js
export default async function handler(req, res) {
  const eventType = req.headers['x-github-event'];
  const payload = req.body;

  // Exemplo: reagir a evento de push
  if (eventType === 'push') {
    console.log('Push recebido:', payload.head_commit.message);
    // Aqui você pode disparar ações adicionais, como rodar testes, enviar notificações, etc.
  }

  res.status(200).json({ message: 'Evento processado' });
}
```

### 2. Criar uma URL pública de webhook com Smee
- Acesse [https://smee.io](https://smee.io)
- Clique em **Start a new channel**.
- Copie a URL gerada, por exemplo: `https://smee.io/abc123`.

### 3. Configurar o Webhook no GitHub
- Vá até **Settings > Webhooks** do seu repositório GitHub.
- Clique em **Add webhook**.
- Cole a URL do Smee no campo **Payload URL**.
- Selecione **application/json** para o formato.
- Marque o evento **Push** (ou outros conforme sua necessidade).
- Opcionalmente, configure um **segredo** para validação.
- Clique em **Add webhook**.

### 4. Rodar o cliente Smee localmente
- Instale o cliente do Smee:

```bash
npm install -g smee-client
```

- Execute o comando para redirecionar os eventos para seu servidor local:

```bash
smee --url https://smee.io/abc123 --target http://localhost:3000/api/webhook
```

> **Importante:** Certifique-se de que seu servidor local (Next.js) está rodando na porta 3000.

### 5. Testar a integração
- Faça um **push** no seu repositório GitHub.
- Você deverá ver, no console do seu agente, a mensagem do commit, indicando que recebeu o evento.

***

## Resumo
- Crie uma rota API no seu agente para receber webhooks.
- Gerar uma URL pública com Smee.
- Configurar o Webhook no GitHub apontando para essa URL.
- Usar o Smee para encaminhar os eventos para seu ambiente de desenvolvimento local.
- Seu agente reage ao evento de push e executa as ações desejadas.

***

Assim, você tem um fluxo automatizado completo que permite que seu agente do Nation interaja e reaja a eventos específicos do seu repositório GitHub, como commits, pull requests ou outros, facilitando automações, testes e integrações contínuas.

Se desejar, posso também ajudar a criar scripts mais avançados ou exemplos de reações específicas a diferentes eventos.
