# Guia Completo: Como Comunicar com seu Agente Nation.fun via X (Twitter)

## Sumário Executivo

O Nation.fun (plataforma Crestal Network) permite criar agentes de IA autônomos com múltiplas capacidades, incluindo integração com X (formerly Twitter). Este guia fornece todas as informações e passos necessários para configurar a comunicação com seu agente via X/Twitter.

---

## 1. Entendendo a Arquitetura

### O que é Nation.fun?

Nation.fun é uma plataforma **no-code** que permite:

- **Criar agentes de IA autônomos** sem necessidade de programação
- **Equipar agentes com Skills (habilidades)** de uma biblioteca de 100+ skills pré-construídas
- **Integrar agentes com múltiplas plataformas**: Twitter/X, Telegram, Discord e mais
- **Monetizar agentes** através de uma economia interna com tokens (NATION e CAP)

### Como Funciona a Integração com X

O Nation.fun usa o framework **IntentKit**, um framework de agentes autônomos de código aberto que inclui:

- **Múltiplos Entrypoints**: Twitter, Telegram, e outros
- **Sistema de Skills extensível**: Mais de 30 módulos de habilidades disponíveis
- **Integração com LangGraph**: Gerenciamento de estado e orquestração de agentes

```
Usuário (Twitter/X)
        ↓
    X API
        ↓
Agente Nation.fun (IntentKit)
        ↓
Skills disponíveis (análise, trading, busca, etc)
        ↓
Respostas via X/Twitter
```

---

## 2. Configuração Inicial do Agente

### 2.1 Criar uma Conta Nation.fun

1. **Acessar plataforma**: https://nation.fun
2. **Conectar wallet** (requer wallet Web3: MetaMask, WalletConnect, etc)
3. **Configurar perfil**:
   - Email
   - Contas de redes sociais (Twitter, Discord, Telegram)
   - Preferências de agente

### 2.2 Criar um Novo Agente

1. **Acesse o Workbench** (interface no-code de Nation.fun)
2. **Click em "Create Agent"** ou "New Agent"
3. **Defina parâmetros básicos**:
   - **Nome do agente**
   - **Descrição/Personalidade** (como o agente deve se comportar)
   - **Avatar/Imagem** (opcional)
   - **Escopos de permissão** (quais skills o agente pode usar)

4. **Selecione Skills** que seu agente precisará:
   - Social Media Management
   - Twitter Post/Reply
   - Data Analysis
   - Market Research
   - Blockchain Interaction
   - Custom Skills (se necessário)

### 2.3 Configurar Credenciais de Twitter/X

Para que seu agente possa postar e interagir no X, você precisa:

1. **Ir a Configurações do Agente** → **Social Media Integration**
2. **Selecionar Twitter/X**
3. **Conectar conta de X**:
   - Autorizar a aplicação Nation.fun a acessar sua conta
   - Conceder permissões necessárias (postagem, leitura de menciones, DMs)
4. **Copiar credentials**:
   - API Key
   - API Secret
   - Bearer Token (se necessário)

---

## 3. Entendendo a Agent API

### 3.1 O que é a Agent API?

A **Agent API** é um endpoint REST que permite comunicação programática com qualquer agente Nation.fun. Lançada recentemente, a API permite:

- **Iniciar conversas** com seu agente via HTTP
- **Enviar e receber mensagens** programaticamente
- **Acessar histórico de chat**
- **Rastrear performance** do agente
- **Streaming de respostas** em tempo real
- **Anexar arquivos e links** aos prompts

### 3.2 Como Obter sua API Key

1. **Acesse o Dashboard** de Nation.fun
2. **Navegue para**: Settings → Developer → Agent API
3. **Click em "Generate API Key"**
4. **Copie a chave gerada** (nunca compartilhe publicamente!)
5. **Armazene em local seguro** ou em arquivo `.env` do seu projeto

```
# .env
NATION_AGENT_API_KEY=seu_api_key_aqui
NATION_AGENT_ID=seu_agent_id_aqui
```

### 3.3 Endpoints Principais da Agent API

#### **POST /api/v1/chat** - Iniciar Conversação

```bash
curl -X POST "https://api.nation.fun/v1/chat" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d {
    "agent_id": "your_agent_id",
    "message": "Olá! Qual é o preço do Bitcoin?",
    "mode": "chat"
  }
```

**Resposta esperada:**
```json
{
  "chat_id": "chat_12345",
  "agent_id": "your_agent_id",
  "message": "Olá! Qual é o preço do Bitcoin?",
  "response": "O preço atual do Bitcoin é de $43,250 USD segundo dados em tempo real.",
  "timestamp": "2025-11-27T10:52:00Z",
  "confidence_score": 0.95
}
```

#### **GET /api/v1/chat/{chat_id}** - Recuperar Histórico

```bash
curl -X GET "https://api.nation.fun/v1/chat/chat_12345" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### **POST /api/v1/chat/{chat_id}/retry** - Reprocessar Mensagem

```bash
curl -X POST "https://api.nation.fun/v1/chat/chat_12345/retry" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 4. Exemplos de Comandos via X (Twitter)

### 4.1 Mencionando o Agente no X

Quando você menciona seu agente no X, ele recebe a mensagem através da integração Twitter:

```
@seu_agente_name Qual é o preço do Bitcoin?
```

O agente receberá via:
- **Twitter Webhook** → **IntentKit Agent** → **Skills** → **Resposta**

### 4.2 Exemplos de Comandos Possíveis

Dependendo das skills configuradas:

```
# Análise de Mercado
@seu_agente Analise o token $TOKEN em relação ao mercado

# Trading Automático
@seu_agente Execute swap de 1 ETH por USDC

# Busca de Informações
@seu_agente Qual a capitalização de mercado da Solana?

# Geração de Conteúdo
@seu_agente Crie uma thread sobre DeFi

# Imagens
@seu_agente Crie uma imagem de um astronauta em Marte
```

### 4.3 Limitações e Cuidados

| Aspecto | Detalhe |
|---------|---------|
| **Limite de Taxa** | 100 requisições por hora via API (free tier) |
| **Latência** | 1-5 segundos de resposta típica |
| **Comprimento de Mensagem** | Máximo 280 caracteres no X (padrão Twitter) |
| **Autenticação** | Requer API Key válida |
| **Encriptação** | Sempre use HTTPS, nunca exponha API keys |
| **Rate Limiting** | Se exceder limite, recebe erro 429 |
| **Conformidade** | Respeite políticas de uso do X e Nation.fun |

---

## 5. Integração Programática com REST API

### 5.1 Exemplo em Python

```python
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("NATION_AGENT_API_KEY")
AGENT_ID = os.getenv("NATION_AGENT_ID")
API_URL = "https://api.nation.fun/v1"

def send_message_to_agent(message):
    """
    Envia mensagem para o agente Nation.fun
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "agent_id": AGENT_ID,
        "message": message,
        "mode": "chat",
        "search_mode": False  # Desabilita busca na web
    }
    
    try:
        response = requests.post(
            f"{API_URL}/chat",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao enviar mensagem: {e}")
        return None

def get_chat_history(chat_id):
    """
    Recupera histórico de conversação
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    
    try:
        response = requests.get(
            f"{API_URL}/chat/{chat_id}",
            headers=headers
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao recuperar histórico: {e}")
        return None

# Usar as funções
if __name__ == "__main__":
    result = send_message_to_agent("Qual é o preço do Bitcoin?")
    if result:
        print("Resposta do agente:")
        print(result.get('response'))
        print(f"Confiança: {result.get('confidence_score')}")
```

### 5.2 Exemplo em JavaScript/Node.js

```javascript
const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.NATION_AGENT_API_KEY;
const AGENT_ID = process.env.NATION_AGENT_ID;
const API_URL = "https://api.nation.fun/v1";

async function sendMessageToAgent(message) {
  const headers = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  };

  const payload = {
    agent_id: AGENT_ID,
    message: message,
    mode: "chat"
  };

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

// Usar a função
(async () => {
  const result = await sendMessageToAgent("Analise o mercado de criptomoedas");
  if (result) {
    console.log("Resposta:");
    console.log(result.response);
  }
})();
```

### 5.3 Exemplo em cURL

```bash
#!/bin/bash

API_KEY="seu_api_key_aqui"
AGENT_ID="seu_agent_id_aqui"
API_URL="https://api.nation.fun/v1"

# Enviar mensagem
curl -X POST "$API_URL/chat" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "'$AGENT_ID'",
    "message": "Qual é o preço do Bitcoin?",
    "mode": "chat"
  }'

# Recuperar histórico
CHAT_ID="chat_12345"
curl -X GET "$API_URL/chat/$CHAT_ID" \
  -H "Authorization: Bearer $API_KEY"
```

---

## 6. Autenticação e Permissões

### 6.1 Tipos de Autenticação

1. **Bearer Token (Recomendado)**
```
Authorization: Bearer YOUR_API_KEY
```

2. **Query Parameter** (menos seguro)
```
GET /api/v1/chat?api_key=YOUR_API_KEY
```

### 6.2 Permissões Necessárias

Ao conectar seu agente com X/Twitter, conceda as seguintes permissões:

- **read:tweets** - Ler tweets e menciones
- **write:tweets** - Postar tweets e respostas
- **read:dm** - Ler mensagens diretas (opcional)
- **write:dm** - Enviar mensagens diretas (opcional)

### 6.3 Rate Limiting e Throttling

**Free Tier:**
- 100 requisições/hora
- 10 requisições/minuto
- 1.000 requisições/mês

**Pro Tier:**
- 1.000 requisições/hora
- 100 requisições/minuto
- 100.000 requisições/mês

---

## 7. Exemplos de Agentes Existentes no Nation.fun

O Nation.fun já possui vários agentes funcionando com integração X:

| Agente | Descrição | Comando |
|--------|-----------|---------|
| **Nation Intern** | Responde perguntas sobre Nation | @nation_intern Qual é o preço? |
| **Kit Agent** | Gera imagens | @intentkitai Crie uma imagem de... |
| **Big Brain Quant** | Análise de mercado crypto | @seu_agente Analise token X |
| **Portfolio Manager** | Gerencia carteira tokenizada | Automático (rebalanceamento) |

---

## 8. Casos de Uso Práticos

### 8.1 Bot de Análise de Mercado

```
Fluxo:
1. Usuário: @seu_agente Qual o preço do Bitcoin?
2. Agente recebe via Twitter Webhook
3. IntentKit executa skill "market_analysis"
4. Agente busca preço em tempo real
5. Responde no X com análise
```

### 8.2 Bot de Trading Automático

```
Fluxo:
1. Usuário: @seu_agente Compre 1 ETH a $2500
2. Agente valida comando
3. Executa skill "blockchain_interaction"
4. Realiza transação on-chain
5. Confirma via X com hash da transação
```

### 8.3 Bot de Suporte ao Cliente

```
Fluxo:
1. Cliente menciona: @suporte_agent Tenho dúvida sobre...
2. Agente recebe via Twitter
3. Busca em base de dados de FAQs
4. Responde com solução
5. Escala para human se necessário
```

---

## 9. Documentação e Recursos Úteis

### 9.1 Links Oficiais

- **Platform**: https://nation.fun
- **GitHub IntentKit**: https://github.com/crestalnetwork/intentkit
- **Documentação**: https://docs.crestal.network (em desenvolvimento)
- **Discord**: https://discord.gg/crestal
- **Twitter**: @crestalnetwork, @intentkitai

### 9.2 Exemplos de Código

- **Repositório de Exemplos**: https://github.com/crestalnetwork/intentkit-examples
- **Agent API Examples**: `/agent-api/` no repositório de exemplos
- **CLI Example**: `/cli/` para interação programática

### 9.3 Community Resources

- Skillwishlist para solicitar novas skills
- Discord #developers para dúvidas
- GitHub Discussions para debates técnicos

---

## 10. Troubleshooting Comum

### Problema: "API Key Inválida"

**Solução:**
- Verifique se a chave foi copiada corretamente
- Confirme que a chave não expirou
- Regenere uma nova chave se necessário

### Problema: "Agent não responde no X"

**Solução:**
- Verifique se as credenciais de Twitter estão conectadas
- Confirme que o agente tem a skill de "Twitter Integration"
- Verifique rate limiting (pode estar bloqueado)
- Cheque logs do agente no dashboard

### Problema: "Erro 429 - Too Many Requests"

**Solução:**
- Implemente backoff exponencial nas requisições
- Reduza frequência de chamadas à API
- Atualize para tier Pro se necessário
- Aguarde 1 hora antes de tentar novamente

### Problema: "Resposta vazia do agente"

**Solução:**
- Verifique se a mensagem atende aos requisitos da skill
- Confirme que a skill necessária está ativada
- Aumente `timeout` nas configurações
- Tente com uma mensagem mais simples

---

## 11. Segurança e Boas Práticas

### 11.1 Proteção de Credenciais

```bash
# ❌ NUNCA FAÇA ISSO
export API_KEY="sua_chave_aqui"
git commit .env

# ✅ FAÇA ISSO
echo ".env" >> .gitignore
export API_KEY=$(cat ~/.secret/nation_api_key)
```

### 11.2 Rate Limiting Implementado no Client

```python
import time
from functools import wraps

def rate_limit(calls_per_minute=10):
    min_interval = 60.0 / calls_per_minute
    last_called = [0.0]
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            wait_time = min_interval - elapsed
            if wait_time > 0:
                time.sleep(wait_time)
            result = func(*args, **kwargs)
            last_called[0] = time.time()
            return result
        return wrapper
    return decorator

@rate_limit(calls_per_minute=10)
def send_message_to_agent(message):
    # Sua chamada à API aqui
    pass
```

### 11.3 Error Handling

```python
import requests
from requests.exceptions import (
    Timeout, 
    ConnectionError, 
    HTTPError
)

def send_with_retry(message, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(
                url,
                headers=headers,
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        
        except Timeout:
            print(f"Tentativa {attempt+1}: Timeout")
            time.sleep(2 ** attempt)  # Exponential backoff
        
        except HTTPError as e:
            if e.response.status_code == 429:
                wait_time = int(e.response.headers.get('Retry-After', 60))
                time.sleep(wait_time)
            else:
                raise
        
        except ConnectionError:
            print("Erro de conexão, tentando novamente...")
            time.sleep(2 ** attempt)
    
    raise Exception("Falha após múltiplas tentativas")
```

---

## 12. Próximos Passos

1. **Crie sua primeira conta** em nation.fun
2. **Configure um agente simples** com skills básicas
3. **Conecte credenciais de X/Twitter**
4. **Teste com mensagens simples**
5. **Implemente integração programática** via API
6. **Monitore performance** do agente
7. **Expanda skills** conforme necessário

---

## 13. Referências e Citações

- Crestal Network - Nation Litepaper
- IntentKit Documentation (GitHub)
- X API v2 Documentation
- Nation.fun Blog - Sistema Monetário de Nation
- Crestal Network Twitter (@crestalnetwork)

---

**Versão:** 1.0  
**Data:** 27 de novembro de 2025  
**Status:** Completo  
**Atualização:** Esta documentação reflete o estado da plataforma Nation.fun a partir de novembro de 2025
