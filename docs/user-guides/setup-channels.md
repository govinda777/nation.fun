# Configurando Canais: WhatsApp

Este guia mostra como configurar a integração do seu agente **nation.fun** com a API do WhatsApp Business.

## Pré-requisitos

-   Conta **Meta Business Manager** verificada.
-   Número de telefone aprovado para uso com a **WhatsApp Business API**.
-   Um **App** criado no [Meta for Developers](https://developers.facebook.com/).
-   Acesso à plataforma **nation.fun** com permissão para configurar um agente.

## 1. Obtenha as Credenciais da Meta

No seu **Meta Developer Dashboard**:

1.  Acesse **Meus Apps** e selecione seu aplicativo.
2.  Ative o produto **WhatsApp** no painel.
3.  Localize e copie com segurança as seguintes credenciais:
    -   `App ID`
    -   `App Secret`
    -   `Access Token` (deve ser um token de longa duração)
    -   `Phone Number ID`
    -   `Business Account ID`

!!! warning "Dica de Segurança"
    Nunca salve suas credenciais em arquivos públicos do Git. Use variáveis de ambiente (`.env`) no seu servidor.

## 2. Configure o Agente no nation.fun

No painel do **nation.fun**:

1.  Vá para **Integrações > APIs Externas > WhatsApp Business**.
2.  Insira as credenciais obtidas no passo anterior nos campos correspondentes.

## 3. Configure o Webhook

Para que seu agente receba mensagens do WhatsApp, você precisa configurar um webhook.

1.  No Meta Developer Dashboard, vá para **Webhooks > WhatsApp Business Account**.
2.  Configure a URL do webhook para o seu agente **nation.fun**:
    ```
    https://seu-agente.nation.fun/api/webhook/whatsapp
    ```
3.  Defina um **Verify Token** (o mesmo valor deve ser configurado no painel do nation.fun).
4.  Selecione os eventos que você deseja receber (ex: `messages`, `message_status`).

Agora seu agente está pronto para enviar e receber mensagens pelo WhatsApp!
