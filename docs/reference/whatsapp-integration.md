# Configurar o Agente Nation com WhatsApp Business API

## 1. Pré-requisitos

*   Conta **Meta Business Manager** verificada.
*   Número de telefone aprovado para uso com **WhatsApp Business API**.
*   Criação de um **App** no [Meta for Developers](https://developers.facebook.com/).
*   Acesso à plataforma **Nation** com permissão para configurar um agente.

## 2. Obter credenciais oficiais da Meta

No **Meta Developer Dashboard**:

1.  Acesse *Meus Apps* → selecione ou crie um novo app.
2.  Ative o **produtor do WhatsApp** no painel.
3.  Localize e copie com segurança:
    *   `App ID`
    *   `App Secret`
    *   `Access Token` (token de longa duração)
    *   `Phone Number ID`
    *   `Business Account ID`

!!! tip "Dica de segurança"
    *   **Nunca** salve credenciais em arquivos públicos do Git.
    *   Use variáveis de ambiente (`.env`) no servidor ou no pipeline do Nation.
    *   Configure permissões de leitura restritas (ex.: `chmod 600 .env` no Linux).
    *   Evite inserir tokens diretamente em códigos ou logs.

## 3. Configurar autenticação no agente Nation

No painel do **Nation**:

1.  Vá até *Integrações > APIs externas > WhatsApp Business*.
2.  Insira variáveis com valores seguros de ambiente:

    ```bash
    WHATSAPP_APP_ID=your_app_id
    WHATSAPP_ACCESS_TOKEN=your_long_lived_token
    WHATSAPP_BUSINESS_ID=your_business_id
    WHATSAPP_PHONE_ID=your_phone_number_id
    ```
3.  Valide as permissões via requisição de teste:
    ```bash
    curl -X GET "https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_ID}/?access_token=${WHATSAPP_ACCESS_TOKEN}"
    ```
    A resposta JSON deve conter detalhes do número cadastrado e confirmar a autenticação.

## 4. Configurar o fluxo básico de mensagens

### Envio de mensagem (Nation → WhatsApp)
```bash
curl -X POST "https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_ID}/messages" \
-H "Authorization: Bearer ${WHATSAPP_ACCESS_TOKEN}" \
-H "Content-Type: application/json" \
-d '{
  "messaging_product": "whatsapp",
  "to": "55XXXXXXXXXX",
  "type": "text",
  "text": { "body": "Olá, este é um teste via agente Nation!" }
}'
```

### Recepção de mensagem (Webhook → Nation)
1.  No Meta Developer Dashboard, vá até *Webhooks* → *WhatsApp Business Account*.
2.  Configure a URL pública do Nation:
    ```
    https://seuagente.nation.io/api/webhook/whatsapp
    ```
3.  Defina o **Verify Token** (mesmo valor no Nation e no Meta).
4.  Selecione os eventos: `messages`, `message_status`, `template_status`.

O Nation agora processará automaticamente entradas e saídas de mensagens via o agente configurado.

## 5. Boas práticas de segurança e conformidade

*   Utilize HTTPS com certificado válido no servidor do Nation.
*   Atualize tokens regularmente (tokens de longa duração expiram após ~60 dias).
*   Monitore o uso com logs seguros e mascaramento de dados pessoais.
*   Respeite a política da Meta: não envie mensagens sem opt-in do usuário.
*   Use webhooks para auditoria e detecção de erros antes do deploy final.
*   Teste apenas em **ambientes sandbox** (Meta Sandbox Numbers) antes de enviar ao público.

## 6. Testes seguros antes do deploy final

1.  Crie um ambiente chamado `staging` no Nation.
2.  Configure variáveis `.env.staging` separadas das de produção.
3.  Use `curl` ou testers integrados do Meta para simular mensagens.
4.  Realize testes com limite de TPS (Transactions per second) baixo.
5.  Monitore os retornos no console do Nation e ajuste o parsing JSON conforme necessário.

> **Dica extra:** automatize seus testes com frameworks como Jest ou Mocha integrados ao fluxo BDD do Nation para validar endpoints antes do deploy.
