

## Tutorial para Integrar Nation com WhatsApp e Responder Mensagens

### 1. Crie e configure seu agente Nation

- Prepare seu agente Nation em Next.js ou outro framework, com um endpoint API para receber requisições webhook, exemplo: `/api/whatsapp-webhook`.
- Esse endpoint receberá as mensagens do WhatsApp enviadas pela API que você usar.

```javascript
// pages/api/whatsapp-webhook.js
export default async function handler(req, res) {
  const body = req.body;
  console.log('Mensagem recebida do WhatsApp:', body);

  // Aqui você pode implementar a lógica para responder, por exemplo:
  const replyMessage = 'Olá! Recebi sua mensagem e vou te ajudar!';

  // Retorne status 200 para confirmar recebimento
  res.status(200).json({ message: 'Evento recebido' });
}
```

### 2. Contrate e configure uma API de WhatsApp (exemplo: Z-API)

- Acesse o site da Z-API (https://z-api.io/).
- Cadastre-se e configure seu número de WhatsApp na plataforma.
- Obtenha seu **Token** de acesso para uso nas requisições.

### 3. Configure o webhook na Z-API para apontar ao seu agente Nation

- Na dashboard da Z-API, configure o endereço do webhook apontando para seu endpoint do agente, por exemplo:
  `https://meu-agente-nation.vercel.app/api/whatsapp-webhook` (ou URL local para desenvolvimento via tunnel como ngrok).

### 4. Implemente o envio de resposta automática no agente Nation usando a API

- Na função que recebe a mensagem (exemplo no passo 1), envie via HTTP POST uma mensagem de volta usando a API da Z-API.

Exemplo básico usando fetch (Node.js):

```javascript
const sendReply = async (phone, message) => {
  const token = 'SEU_TOKEN_DA_ZAPI';
  const url = `https://api.z-api.io/${token}/send-message`;

  const body = {
    phone,
    message
  };

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
};
```

- Chame `sendReply` passando o número do remetente e a mensagem de resposta para responder automaticamente.

### 5. Teste e ajuste

- Envie uma mensagem para o número configurado na Z-API.
- Verifique se seu agente recebe a mensagem no webhook.
- Confira se a resposta automática é enviada de volta ao WhatsApp do usuário.

***

## Resumo

| Passo                        | Descrição                                            |
|-----------------------------|------------------------------------------------------|
| 1. Criar endpoint API        | Recebem mensagens do WhatsApp via webhook           |
| 2. Criar conta na Z-API      | Configurar número e obter token para API             |
| 3. Configurar webhook Z-API  | Apontar webhook da Z-API para agente Nation           |
| 4. Implementar envio de resposta | Enviar mensagem via API a partir do agente       |
| 5. Testar                    | Enviar mensagens e validar respostas automáticas     |

Quer o código completo para o agente Nation pronto para essa integração? Posso montar para você.

Fontes
[1] Como integrar Agentes IA ao WhatsApp - A maneira mais fácil https://www.youtube.com/watch?v=P1t28pzbO08
[2] Como integrar WhatsApp, e-mail e telefone em uma única plataforma https://primetechsolution.com.br/en/blog/integrar-whatsapp-email-telefone-uma-plataforma/
[3] 24 Melhores ferramentas de automação do WhatsApp para usar em ... https://www.kommo.com/br/blog/ferramentas-de-automacao-no-whatsapp/
[4] Como integrar n8n com WhatsApp passo a passo - Hora de Codar https://horadecodar.com.br/integrar-n8n-whatsapp-passo-passo/
[5] Como integrar n8n com WhatsApp Business API - Hora de Codar https://horadecodar.com.br/integrar-n8n-whatsapp-business-api/
[6] Envio de Mensagens Automáticas no WhatsApp com Make e Z-API https://www.youtube.com/watch?v=4A2BmsHaFi8
[7] API Oficial do WhatsApp: O Guia Definitivo para Empresas (e Por ... https://aspa.chat/blog/api-oficial-whatsapp-guia-completo
[8] Como utilizar o WhatsApp Business Cloud API na plataforma n8n https://www.youtube.com/watch?v=nWHWzj1_c0Q
[9] Como integrar o WhatsApp com outros sistemas para automação total https://jornaldebrasilia.com.br/inovacao/como-integrar-o-whatsapp-com-outros-sistemas-para-automacao-total/
[10] Integração - Whatsapp Mensageiros - Wiki HubSoft https://wiki.hubsoft.com.br/pt-br/modulos/configuracao/integracao/sms/whatsapp_mensageiros
