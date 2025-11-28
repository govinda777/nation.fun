# Guia de Implementação: Bot Agente do Twitter

Este guia fornece instruções técnicas para configurar, executar e entender a implementação do bot de agente para o Twitter.

## 1. Visão Geral da Arquitetura

O bot é construído sobre a stack Next.js e TypeScript do projeto `nation.fun`. Sua principal função é verificar periodicamente novas menções a uma conta do Twitter, processar o texto dessas menções através de um agente da Nation.fun e postar a resposta do agente de volta no Twitter.

### Componentes Principais:

- **`TwitterAgentListener` (`src/lib/agents/twitter-agent.ts`):** O orquestrador principal. Usa `node-cron` para executar a lógica de polling (verificação periódica) e interage com as APIs.
- **`NationAgentClient` (`src/lib/agents/nation-client.ts`):** Um cliente robusto para a API da Nation.fun. Inclui lógica de retentativas com backoff exponencial.
- **Utilitários (`src/lib/utils/`):** Módulos para logging (`pino`), rate limiting e tratamento de erros.
- **Endpoints de API (`pages/api/bot/twitter/`):** Inclui um endpoint de `health check` para monitoramento.

## 2. Configuração do Ambiente

Para executar o bot, você precisa configurar as seguintes variáveis de ambiente. Copie o arquivo `.env.example` para `.env.local` e preencha os valores:

```env
# Nation.fun API
NATION_API_KEY=sua_chave_de_api_do_nation_aqui
NATION_AGENT_ID=o_id_do_seu_agente_aqui
NATION_API_BASE_URL=https://api.nation.fun/v1

# Twitter/X API v2
# (Requer permissões de App para ler e escrever)
TWITTER_API_KEY=sua_app_key_do_twitter_aqui
TWITTER_API_SECRET=seu_app_secret_do_twitter_aqui
TWITTER_ACCESS_TOKEN=seu_access_token_de_usuário_aqui
TWITTER_ACCESS_SECRET=seu_access_secret_de_usuário_aqui

# Configuração do Bot
BOT_CHECK_INTERVAL=60 # Intervalo em segundos para verificar menções
BOT_LOG_LEVEL=info    # Nível de log (trace, debug, info, warn, error)
```

**Importante:** O bot ainda não é instanciado ou executado automaticamente. A lógica de inicialização (`runContinuously`) precisará ser chamada a partir de um local apropriado na aplicação (por exemplo, em um processo de background ou em um endpoint de inicialização).

## 3. Execução e Testes

### Executando a Aplicação

Para rodar o ambiente de desenvolvimento do Next.js:

```bash
npm run dev
```

### Rodando os Testes Unitários

Os testes unitários cobrem a lógica principal dos módulos do bot e usam o Jest. Para executá-los:

```bash
npm test
```

Você também pode executar testes para um arquivo específico:

```bash
npm test -- __tests__/unit/agents/twitter-agent.test.ts
```

## 4. Estrutura dos Módulos

- **`src/lib/agents/types.ts`**: Define as interfaces TypeScript compartilhadas (`Message`, `Tweet`, etc.).
- **`src/lib/agents/nation-client.ts`**: Classe para comunicação com a API do Nation.fun.
- **`src/lib/agents/twitter-agent.ts`**: Classe que contém a lógica de polling, processamento e resposta no Twitter.
- **`src/lib/utils/logger.ts`**: Configuração do logger `pino`.
- **`src/lib/utils/rate-limiter.ts`**: Utilitário para controle de taxa de requisições.
- **`src/lib/utils/error-handler.ts`**: Centraliza o tratamento de erros.
- **`pages/api/bot/twitter/health.ts`**: Endpoint de monitoramento.
- **`__tests__/unit/**`**: Contém os testes unitários para os módulos do bot.
