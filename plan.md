📋 Plano de Desenvolvimento - Nation.fun

Site: https://govinda777.github.io/nation.fun/

Repo: https://github.com/govinda777/nation.fun

Contexto do Projeto

O nation.fun é uma plataforma inovadora que permite aos usuários criar, configurar e gerenciar agentes de IA autônomos. Atualmente, o projeto possui uma interface básica de chat hospedada no GitHub Pages. O objetivo é evoluir para uma plataforma completa com autenticação Web3, marketplace de NFTs (Nation Pass), sistema de créditos baseado em tokens NATION, e configuração avançada de agentes de IA.

Criação de agente autônomo na plataforma ⁠ nation.fun ⁠ que tenha a habilidade de enviar mensagens para  o Whatsapp. Esse agente ficará escutando um webhook que será as mensagens enviadas via whatsapp.

---

Time Box: 2 sprints (2 semanas por sprint)

Orçamento: R$ 3100 (em ETH)

---

Jornada : 

•⁠  ⁠1 - Login via privy 
•⁠  ⁠2 - Comprar a NFT do agente ⁠ nation pass ⁠ 
•⁠  ⁠3 - Criar um novo agente e definir o escopo de atuação.

ex: Você é um atendente de um consultório de dentista  , é capaz de se comunicar com o Google agenda e marcar consultas nos horários disponíveis. 

Você também consegue ajudar os pacientes a tirar dúvidas sobre exames e status do seu tratamento.

•⁠  ⁠4 - Configurar a chave de API do Whatsapp e salva-la via lit protocol ( ou seja iremos mintar uma nft e guardar a chave de API do whatsapp nessa nft de forma criptografada.
•⁠  ⁠5 - Testes : Aqui o sistema oriente o usuário a como fazer um teste.
•⁠  ⁠6 - Faq : dúvidas frequentes e tutoriais importantes 
•⁠  ⁠7 - Feedback : Ao término do feedback vc ganha 100 tokens de test para provar a plataforma.

Conceitos Fundamentais

Agentes de IA Autônomos: São assistentes virtuais inteligentes programáveis que podem executar tarefas específicas, responder perguntas e interagir com usuários através de diferentes canais (chat web, WhatsApp, Telegram).[1][2][3]

Nation Pass NFT: É um token não fungível (NFT) que funciona como um passe de acesso para criar e gerenciar agentes na plataforma. Disponível na coleção OpenSea na rede Base, com supply de 8.887 NFTs.[4][5]

Token NATION (NATO): Criptomoeda nativa do ecossistema, construída na blockchain Base (Layer 2 do Ethereum). Com supply total de 1 trilhão de tokens e liquidez bloqueada até 2030. Utilizada para pagamentos, governança e créditos dos agentes.[6][7][8]

Privy Authentication: Sistema de autenticação Web3 que suporta múltiplos métodos (email, SMS, carteiras cripto, redes sociais) com tokens JWT seguros.[2][9][1]

BDD (Behavior-Driven Development): Metodologia de desenvolvimento orientada por comportamento que utiliza linguagem Gherkin para descrever testes em formato legível por humanos (Given-When-Then).[10][11]

#📑 Estrutura de Tarefas - Roadmap Incremental

#FASE 0: Estrutura e Fundação

#Task 0.1: Análise e Documentação da Estrutura Atual

Prioridade: 🔴 CríticaComplexidade: ⭐ Fácil

Objetivo: Mapear e documentar completamente a estrutura atual do projeto.

Contexto: Antes de implementar novas funcionalidades, precisamos entender profundamente o que já existe. O repositório menciona uso de Next.js, BDD com Gherkin, testes unitários e GitHub Pages, mas precisamos validar a estrutura real.

Passos:

Clone o repositório: git clone https://github.com/govinda777/nation.fun.git

Analise a estrutura de pastas e identifique:

Componentes React existentes

Configuração do Next.js (next.config.js)

Arquivos de teste (.feature, .spec, .test)

Estrutura de roteamento (pages/ ou app/)

Assets e estilos (public/, styles/)

Documente cada arquivo principal e sua função

Identifique dependências no package.json

Verifique a configuração do GitHub Pages

Critérios de Aceitação:

Documento markdown com estrutura completa do projeto

Lista de dependências e suas versões

Identificação de gaps técnicos

Mapa visual da arquitetura atual

Ferramentas: VSCode, navegador, terminal

#Task 0.2: Setup do Ambiente de Desenvolvimento Local

Prioridade: 🔴 CríticaComplexidade: ⭐ Fácil

Objetivo: Garantir que o ambiente de desenvolvimento local funcione perfeitamente.

Contexto: Um ambiente estável é fundamental para desenvolvimento ágil e testes consistentes.

Passos:

Instale as dependências: npm install ou yarn install

Execute o projeto localmente: npm run dev

Verifique se abre em http://localhost:3000

Teste hot-reload fazendo pequenas alterações

Execute os testes existentes: npm run test

Configure variáveis de ambiente (criar .env.local)

Critérios de Aceitação:

Projeto roda sem erros no localhost

Hot-reload funcionando

Testes executam corretamente

.env.local configurado com variáveis necessárias

Ferramentas: Node.js 16+, npm/yarn, Git

#FASE 1: Homepage Pública e Branding

#Task 1.1: Criar Estrutura da Homepage Pública

Prioridade: 🟠 AltaComplexidade: ⭐⭐ Média

Objetivo: Desenvolver a página inicial pública que explica o projeto, inspirada no projeto de referência.[12]

Contexto: A homepage é o primeiro contato do usuário com a plataforma. Deve ser clara, profissional e explicar o valor da solução. O projeto de referência (govinda_systems_bot) serve como inspiração para estrutura e design.

Passos:

Criar componente HomePage.tsx em components/

Estruturar seções:

Hero section com título e CTA

Seção "O que é Nation.fun"

Seção "Como funciona" (3-4 passos)

Showcase de agentes exemplo

Seção de benefícios/features

Footer com links importantes

Implementar design responsivo (mobile-first)

Adicionar animações sutis (scroll reveal, fade-in)

Criar testes BDD para componente

Especificação BDD (features/homepage.feature):

Feature: Homepage Pública
  Como visitante
  Quero entender o que é Nation.fun
  Para decidir se quero usar a plataforma

  Scenario: Visualizar informações principais
    Given eu acesso a homepage
    Then devo ver o título "Nation.fun"
    And devo ver a descrição do projeto
    And devo ver o botão "Começar"

  Scenario: Navegação responsiva
    Given eu acesso a homepage em dispositivo móvel
    Then o menu deve ser responsivo
    And o conteúdo deve se adaptar à tela

Critérios de Aceitação:

Homepage renderiza com todas as seções

Design 100% responsivo (mobile, tablet, desktop)

Testes BDD passando

Performance Lighthouse > 90

Acessibilidade WCAG AA

Ferramentas: React, TypeScript, CSS Modules/Tailwind, Cucumber.js

#Task 1.2: Integrar Conteúdo e Assets Visuais

Prioridade: 🟡 MédiaComplexidade: ⭐ Fácil

Objetivo: Adicionar textos finais, imagens, ícones e branding à homepage.

Contexto: Conteúdo de qualidade e recursos visuais profissionais elevam a credibilidade da plataforma.

Passos:

Escrever textos persuasivos para cada seção

Criar/obter imagens (screenshots, mockups, ícones)

Adicionar logo da Nation.fun

Implementar SEO meta tags

Adicionar Open Graph tags para compartilhamento social

Otimizar imagens (Next.js Image component)

Critérios de Aceitação:

Todos os textos revisados e sem erros

Imagens otimizadas (WebP, lazy loading)

Meta tags configuradas

Logo e favicon implementados

Preview de compartilhamento social funcionando

#FASE 2: Sistema de Autenticação Web3

#Task 2.1: Configurar Privy Authentication

Prioridade: 🔴 CríticaComplexidade: ⭐⭐⭐ Complexa

Objetivo: Implementar sistema de autenticação usando Privy, suportando múltiplos métodos de login.[9][1][2]

Contexto: Privy é uma solução completa de autenticação Web3 que suporta email, SMS, redes sociais e carteiras cripto. Oferece embedded wallets e integração simples com dApps.[13][1][2]

Conceitos Técnicos:

Access Token (JWT): Token de curta duração (1 hora) assinado com Ed25519, usado para validar requisições autenticadas[1]

Refresh Token: Token de longa duração (30 dias) que permite renovar sessões sem reautenticação[1]

Embedded Wallets: Carteiras cripto gerenciadas pelo Privy que facilitam onboarding Web3[14]

Passos:

Criar conta no Privy Dashboard (privy.io)

Obter App ID e configurar métodos de autenticação

Instalar dependências: npm install @privy-io/react-auth

Configurar PrivyProvider em _app.tsx:

import { PrivyProvider } from '@privy-io/react-auth';

function MyApp({ Component, pageProps }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet', 'google'],
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
        },
      }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
}

Criar componente LoginButton.tsx

Implementar hook personalizado useAuth.ts

Proteger rotas com withAuth HOC

Configurar variáveis de ambiente

Especificação BDD (features/authentication.feature):

Feature: Autenticação de Usuários
  Como usuário
  Quero fazer login na plataforma
  Para acessar funcionalidades restritas

  Scenario: Login com email bem-sucedido
    Given eu estou na página de login
    When eu clico em "Login com Email"
    And eu insiro meu email válido
    And eu recebo o código OTP
    And eu insiro o código correto
    Then devo ser autenticado
    And devo ser redirecionado para o dashboard

  Scenario: Login com carteira Metamask
    Given eu tenho Metamask instalado
    When eu clico em "Conectar Carteira"
    And eu aprovo a conexão no Metamask
    Then devo ser autenticado com minha carteira

Critérios de Aceitação:

Login funciona com email, Google e carteiras (Metamask, WalletConnect)

Sessão persiste após refresh da página

Logout funciona corretamente

Tokens JWT validados no backend

Testes BDD passando para todos os métodos

Ferramentas: Privy SDK, React, TypeScript, Cucumber.js

#Task 2.2: Criar Páginas de Login e Registro

Prioridade: 🟠 AltaComplexidade: ⭐⭐ Média

Objetivo: Desenvolver UI/UX para fluxos de autenticação.[15][16][17]

Contexto: Interface clara e intuitiva reduz fricção no onboarding e aumenta conversão.

Passos:

Criar pages/login.tsx e pages/signup.tsx

Implementar form validation (React Hook Form)

Adicionar estados de loading e erro

Criar modal de seleção de método de login

Implementar feedback visual para cada etapa

Adicionar links de recuperação de senha

Garantir acessibilidade (ARIA labels, keyboard navigation)

Critérios de Aceitação:

Formulários validam inputs corretamente

Feedback claro para erros (mensagens amigáveis)

Loading states durante autenticação

Redirecionamento correto após login

Experiência mobile otimizada

#FASE 3: Área Logada - Dashboard e Chat

#Task 3.1: Criar Layout da Área Logada

Prioridade: 🟠 AltaComplexidade: ⭐⭐ Média

Objetivo: Desenvolver estrutura de navegação e layout para área autenticada.

Contexto: Layout consistente e navegação clara melhoram UX e facilitam desenvolvimento de novas features.

Passos:

Criar componente DashboardLayout.tsx

Implementar sidebar com navegação

Adicionar header com perfil do usuário

Criar sistema de rotas protegidas

Implementar breadcrumbs

Adicionar menu mobile (hamburguer)

Estrutura de Navegação:

🏠 Dashboard (visão geral)

💬 Chat com Agente

🤖 Meus Agentes

🎫 Comprar Nation Pass

💰 Gerenciar Créditos

⚙️ Configurações

🚪 Logout

Critérios de Aceitação:

Sidebar funcional com navegação

Header exibe dados do usuário autenticado

Rotas protegidas redirecionam não-autenticados

Layout responsivo

Transições suaves entre páginas

#Task 3.2: Integrar Interface de Chat Existente

Prioridade: 🔴 CríticaComplexidade: ⭐⭐ Média

Objetivo: Migrar e aprimorar a interface de chat atual (https://govinda777.github.io/nation.fun/) para área logada.[18][19][20]

Contexto: O chat já existe e funciona no GitHub Pages atual. Precisamos integrá-lo na nova estrutura autenticada, mantendo funcionalidades e melhorando UX.

Passos:

Analisar código do chat atual

Migrar componentes para nova estrutura

Conectar com contexto de autenticação (Privy)

Adicionar histórico de conversas

Implementar salvamento de mensagens

Adicionar indicadores de digitação/status

Otimizar performance para conversas longas

Critérios de Aceitação:

Chat renderiza corretamente na área logada

Mensagens são associadas ao usuário autenticado

Histórico persiste entre sessões

Performance estável com 100+ mensagens

UI responsiva e acessível

#FASE 4: Marketplace de NFTs (Nation Pass)

#Task 4.1: Integrar Dados da Coleção OpenSea

Prioridade: 🟠 AltaComplexidade: ⭐⭐⭐ Complexa

Objetivo: Exibir NFTs da coleção Nation Pass disponíveis na OpenSea.[5][21][4]

Contexto: A coleção Nation Pass já existe na OpenSea (rede Base) com 8.887 NFTs. Precisamos integrar via API da OpenSea para exibir NFTs disponíveis, preços e permitir compra.[4]

Conceitos Técnicos:

OpenSea API: API REST que permite consultar coleções, NFTs, listings e histórico de transações

Rede Base: Layer 2 do Ethereum focada em baixas taxas e velocidade

Smart Contract ERC-721: Padrão de NFT na Ethereum, cada token é único e indivisível

Passos:

Obter API key da OpenSea

Criar serviço openSeaService.ts para chamadas à API

Implementar endpoint /api/nfts/nation-pass (API Route Next.js)

Criar componente NFTCard.tsx para exibir NFT individual

Criar página pages/marketplace.tsx

Implementar filtros (preço, traits, raridade)

Adicionar paginação

Criar cache de dados (React Query ou SWR)

Exemplo de Integração:

// services/openSeaService.ts
export async function getNationPassNFTs() {
  const response = await fetch(
    'https://api.opensea.io/api/v2/collection/nation-pass-alpha/nfts',
    {
      headers: {
        'X-API-KEY': process.env.OPENSEA_API_KEY,
      },
    }
  );
  return response.json();
}

Critérios de Aceitação:

Lista de NFTs carrega da API OpenSea

Exibe preço, imagem, traits de cada NFT

Filtros funcionam corretamente

Paginação implementada

Loading states e error handling

Cache reduz chamadas à API

Ferramentas: OpenSea API, React Query, Next.js API Routes

#Task 4.2: Implementar Fluxo de Compra de NFT

Prioridade: 🔴 CríticaComplexidade: ⭐⭐⭐⭐ Muito Complexa

Objetivo: Permitir compra de Nation Pass NFT diretamente na plataforma, vinculando à carteira do usuário Privy.[22][23][24]

Contexto: Esta é a funcionalidade core de monetização. O usuário precisa comprar um Nation Pass NFT para criar agentes. A compra deve ser segura, vinculada à carteira Privy do usuário e executada on-chain na rede Base.[4][1]

Conceitos Técnicos:

Smart Contract Interaction: Chamadas para funções do contrato (mint, transfer, approve)

Gas Fees: Taxas pagas para executar transações na blockchain

Wallet Signing: Usuário assina transação com chave privada para aprovar

Transaction Confirmation: Aguardar confirmação on-chain (vários blocos)

Passos:

Configurar Privy para usar rede Base

Instalar ethers.js ou viem para interação com contratos

Obter ABI do contrato Nation Pass

Criar serviço nftPurchaseService.ts:

Função para verificar se usuário possui NFT

Função para iniciar compra (chamar contrato)

Função para confirmar transação

Implementar componente NFTPurchaseModal.tsx

Adicionar estados da transação (pending, success, error)

Salvar compra no banco de dados (indexação)

Enviar confirmação por email

Atualizar UI após compra bem-sucedida

Fluxo de Compra:

Usuário clica em "Comprar NFT"

Modal abre com detalhes e preço

Usuário confirma compra

Privy solicita assinatura da transação

Transação é enviada à rede Base

Loading enquanto aguarda confirmação

Success screen com link para OpenSea

NFT aparece na carteira do usuário

Especificação BDD (features/nft-purchase.feature):

Feature: Compra de Nation Pass NFT
  Como usuário autenticado
  Quero comprar um Nation Pass NFT
  Para poder criar meus agentes de IA

  Scenario: Compra bem-sucedida
    Given eu estou autenticado
    And eu tenho saldo suficiente em ETH
    When eu acesso a página de marketplace
    And eu seleciono um Nation Pass disponível
    And eu clico em "Comprar"
    And eu confirmo a transação na carteira
    Then a transação deve ser processada
    And o NFT deve aparecer na minha carteira
    And eu devo poder criar um agente

  Scenario: Compra sem saldo suficiente
    Given eu estou autenticado
    And eu não tenho saldo suficiente
    When eu tento comprar um NFT
    Then devo ver mensagem de erro
    And devo receber instruções para adicionar fundos

Critérios de Aceitação:

Modal de compra exibe todas as informações do NFT

Transação é assinada com carteira Privy

Confirmação on-chain é aguardada e exibida

NFT aparece na carteira após compra

Erros são tratados (saldo insuficiente, rejeição)

Testes BDD passando

Documentação do fluxo completa

Ferramentas: Privy, ethers.js/viem, Base blockchain, OpenSea API

#FASE 5: Sistema de Créditos (Token NATION)

#Task 5.1: Criar Interface de Gerenciamento de Créditos

Prioridade: 🟠 AltaComplexidade: ⭐⭐ Média

Objetivo: Desenvolver dashboard para visualizar, comprar e carregar créditos NATION nos agentes.[7][8][6]

Contexto: Tokens NATION (NATO) são a moeda do ecossistema. Usuários compram tokens e carregam créditos em seus agentes. Cada interação com o agente consome créditos. Supply total: 1 trilhão, disponível na rede Base.[8][6][7]

Conceitos:

Créditos: Unidade de consumo dentro da plataforma (1 crédito = X tokens NATO)

Balance: Saldo disponível do usuário

Agent Balance: Créditos carregados em cada agente específico

Passos:

Criar página pages/credits.tsx

Exibir saldo atual de tokens NATO

Exibir créditos carregados por agente

Criar componente CreditPurchaseModal.tsx

Implementar conversão NATO → Créditos

Adicionar histórico de transações

Criar gráfico de consumo de créditos

Layout da Página:

Card com saldo total de NATO

Card com créditos disponíveis

Lista de agentes e créditos por agente

Botão "Comprar Créditos"

Histórico de transações (tabela)

Critérios de Aceitação:

Saldo de NATO é exibido corretamente

Créditos por agente são listados

Histórico de transações funciona

UI responsiva e clara

Atualização em tempo real

#Task 5.2: Integrar Compra de Tokens NATION

Prioridade: 🔴 CríticaComplexidade: ⭐⭐⭐⭐ Muito Complexa

Objetivo: Permitir compra de tokens NATION via carteira, integrando com DEX ou swap direto.[25][26][14]

Contexto: Usuários precisam adquirir tokens NATION para usar como créditos. Podemos integrar com Uniswap (Base) para swap direto ETH → NATO ou criar compra direta via contrato.[7][8]

Opções de Implementação:

Widget Uniswap: Embed do widget oficial da Uniswap

Integração direta com Router: Chamar contrato do Uniswap via ethers.js

Parceria com gateway: Usar serviço como MoonPay ou Transak

Passos (Opção Widget Uniswap):

Instalar @uniswap/widgets

Configurar widget com token NATO address

Criar componente TokenPurchaseWidget.tsx

Integrar com Privy wallet

Adicionar confirmação e atualização de saldo

Implementar fallback para mobile

Código Exemplo:

import { SwapWidget } from '@uniswap/widgets';

<SwapWidget
  tokenList={[
    { address: NATO_TOKEN_ADDRESS, chainId: BASE_CHAIN_ID },
  ]}
  defaultOutputTokenAddress={NATO_TOKEN_ADDRESS}
  provider={privyProvider}
/>

Critérios de Aceitação:

Widget/integração funciona na rede Base

Swap ETH → NATO executa corretamente

Saldo atualiza após compra

Gas fees são exibidos claramente

Erros são tratados (slippage, falhas)

Suporte mobile funcional

Ferramentas: Uniswap SDK, ethers.js, Privy, Base blockchain

#Task 5.3: Implementar Sistema de Carregamento de Créditos nos Agentes

Prioridade: 🟠 AltaComplexidade: ⭐⭐⭐ Complexa

Objetivo: Permitir transferência de créditos do saldo do usuário para agentes específicos.

Contexto: Cada agente possui seu próprio saldo de créditos. Usuário aloca créditos aos agentes que deseja ativar/usar.

Passos:

Criar tabela agent_credits no banco de dados

Implementar API /api/credits/transfer:

Validar saldo do usuário

Debitar do usuário

Creditar no agente

Registrar transação

Criar componente LoadCreditsModal.tsx

Adicionar validações (saldo suficiente, limites)

Implementar notificações de sucesso/erro

Criar logs de auditoria

Critérios de Aceitação:

Transferência de créditos funciona corretamente

Validações impedem transferências inválidas

Saldos atualizam em tempo real

Histórico de transferências é salvo

UI clara e intuitiva

#FASE 6: Configuração de Agentes

#Task 6.1: Criar Interface de Criação de Agente

Prioridade: 🔴 CríticaComplexidade: ⭐⭐⭐ Complexa

Objetivo: Desenvolver wizard/formulário para criar novo agente de IA.[27][28][29]

Contexto: Após comprar Nation Pass NFT, usuário pode criar agente. Precisa configurar nome, propósito, instruções e persona.[28][27]

Conceitos:

Propósito do Agente: Objetivo principal (atendimento médico, suporte técnico, vendas)

Instruções/Prompt: Contexto e regras que o agente deve seguir

Persona: Tom de voz, personalidade (formal, casual, técnico)

Skills: Capacidades específicas (buscar informações, criar tickets, etc.)

Passos:

Criar página pages/agents/create.tsx

Implementar wizard multi-step:

Step 1: Informações básicas (nome, descrição)

Step 2: Selecionar template ou criar do zero

Step 3: Configurar propósito e instruções

Step 4: Definir persona e tom

Step 5: Alocar créditos iniciais

Step 6: Revisão e confirmação

Adicionar preview do agente durante configuração

Implementar validações em cada step

Salvar rascunhos (auto-save)

Criar API /api/agents/create

Templates Disponíveis:[30][31][32]

🏥 Atendente de Clínica Médica: Agendamentos, informações sobre procedimentos

🏗️ Atendente de Engenharia: Suporte técnico, orçamentos, gerenciamento de projetos

🛒 Atendente de E-commerce: Dúvidas sobre produtos, rastreamento de pedidos, vendas

Critérios de Aceitação:

Wizard com todos os steps funciona

Templates pré-configurados disponíveis

Preview mostra configuração em tempo real

Validações impedem criação incompleta

Agente é salvo no banco de dados

NFT é vinculado ao agente criado

Créditos iniciais são alocados

#Task 6.2: Desenvolver Editor de Configuração de Agente

Prioridade: 🟠 AltaComplexidade: ⭐⭐⭐ Complexa

Objetivo: Criar interface para editar configurações de agentes existentes.[29][27][28]

Contexto: Usuários precisam refinar agentes após criação, ajustando instruções, persona e skills.

Passos:

Criar página pages/agents/[id]/edit.tsx

Carregar configuração atual do agente

Implementar editor de instruções (Monaco Editor ou similar)

Adicionar seção de configuração de persona:

Tom de voz (profissional, casual, divertido)

Comprimento de respostas (curto, médio, longo)

Nível de formalidade

Criar gerenciador de skills/comandos:

Lista de skills disponíveis

Habilitar/desabilitar skills

Configurar parâmetros de cada skill

Implementar teste de configuração (preview chat)

Adicionar histórico de versões (tracking de mudanças)

Criar API /api/agents/[id]/update

Skills Configuráveis:[27]

🔍 Busca de informações

📅 Agendamentos

🎫 Criação de tickets

📊 Geração de relatórios

🔗 Integrações (CRM, calendários)

Critérios de Aceitação:

Editor carrega configuração atual

Mudanças são salvas corretamente

Preview mostra comportamento do agente

Skills podem ser habilitadas/desabilitadas

Histórico de versões funciona

Validações impedem configurações inválidas

#FASE 7: Canais de Atendimento (WhatsApp e Telegram)

#Task 7.1: Integrar Canal WhatsApp

Prioridade: 🟠 AltaComplexidade: ⭐⭐⭐⭐ Muito Complexa

Objetivo: Permitir que agentes respondam mensagens via WhatsApp Business API.[33][34][35]

Contexto: WhatsApp é o canal de comunicação mais usado no Brasil. Integração permite que agentes atendam clientes onde eles estão. Requer WhatsApp Business API (diferente de WhatsApp Business App).[34][33]

Conceitos Técnicos:

WhatsApp Business API: API oficial do Meta para empresas enviarem/receberem mensagens

Webhook: Endpoint que recebe notificações de mensagens recebidas

Message Templates: Mensagens pré-aprovadas para iniciar conversas

Session Messages: Janela de 24h para responder livremente

Passos:

Criar conta WhatsApp Business no Meta Business Manager

Configurar número de telefone e verificação

Obter credenciais da API (Access Token, Phone Number ID)

Criar webhook endpoint /api/webhooks/whatsapp:

Validação de verificação do Meta

Recebimento de mensagens

Processamento e resposta

Implementar serviço whatsAppService.ts:

Enviar mensagens

Enviar mídias (imagens, documentos)

Gerenciar templates

Criar fila de mensagens (Bull/BullMQ)

Implementar persistência de conversas

Adicionar configuração na interface do agente

Criar dashboard de métricas do canal

Fluxo de Mensagem:

Cliente envia mensagem no WhatsApp

Meta envia webhook para nossa API

Sistema identifica agente responsável

Agente processa mensagem (IA)

Resposta é enviada via API

Cliente recebe resposta no WhatsApp

Especificação BDD (features/whatsapp-channel.feature):

Feature: Canal de Atendimento WhatsApp
  Como dono de um agente
  Quero que meu agente responda no WhatsApp
  Para atender meus clientes via WhatsApp

  Scenario: Receber e responder mensagem
    Given meu agente está configurado para WhatsApp
    When um cliente envia "Olá" no WhatsApp
    Then o agente deve receber a mensagem
    And o agente deve processar com IA
    And o agente deve responder no WhatsApp
    And o cliente deve receber a resposta

  Scenario: Enviar mídia na resposta
    Given meu agente está configurado
    When o cliente pede uma imagem
    Then o agente deve enviar imagem via WhatsApp

Critérios de Aceitação:

Webhook recebe mensagens corretamente

Agente responde automaticamente

Suporta texto, imagens e documentos

Conversas são persistidas

Dashboard exibe métricas do canal

Erros são logados e notificados

Testes BDD passando

Ferramentas: WhatsApp Business API, Next.js API Routes, BullMQ, PostgreSQL

Documentação Oficial: https://developers.facebook.com/docs/whatsapp

#Task 7.2: Integrar Canal Telegram

Prioridade: 🟠 AltaComplexidade: ⭐⭐⭐ Complexa

Objetivo: Permitir que agentes respondam mensagens via Telegram Bot.[35][33][34]

Contexto: Telegram oferece Bot API robusta e gratuita, sem restrições da API do WhatsApp. Ideal para comunidades e suporte técnico.

Conceitos Técnicos:

Telegram Bot API: API gratuita para criar bots

Long Polling vs Webhook: Métodos para receber mensagens

Inline Keyboards: Botões interativos nas mensagens

Commands: Comandos especiais (/start, /help, etc.)

Passos:

Criar bot via @BotFather no Telegram

Obter Bot Token

Configurar webhook /api/webhooks/telegram

Implementar serviço telegramService.ts:

Enviar mensagens

Enviar mídias

Criar keyboards

Gerenciar comandos

Criar fila de mensagens

Implementar persistência de conversas

Adicionar configuração na interface do agente

Criar dashboard de métricas

Comandos Padrão:

/start - Iniciar conversa

/help - Ajuda

/reset - Resetar contexto

/status - Status do agente

Critérios de Aceitação:

Bot recebe e responde mensagens

Comandos funcionam corretamente

Suporta mídias e keyboards

Conversas são persistidas

Dashboard exibe métricas

Integração com múltiplos agentes

Ferramentas: Telegram Bot API, node-telegram-bot-api, Next.js

Documentação Oficial: https://core.telegram.org/bots/api

#FASE 8: Deploy e Otimização

#Task 8.1: Configurar CI/CD com GitHub Actions

Prioridade: 🔴 CríticaComplexidade: ⭐⭐ Média

Objetivo: Automatizar build, testes e deploy para GitHub Pages.[36][37][38][39]

Contexto: Pipeline automatizado garante qualidade e agilidade em deploys. GitHub Actions é gratuito para repositórios públicos.

Passos:

Criar arquivo .github/workflows/deploy.yml

Configurar jobs:

Lint: Verificar código (ESLint, Prettier)

Test: Executar testes unitários e BDD

Build: Compilar Next.js em modo estático

Deploy: Publicar em GitHub Pages

Configurar triggers (push em main, PRs)

Adicionar cache de dependências

Configurar variáveis de ambiente secretas

Adicionar badge de status no README

Arquivo de Workflow:

name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out

Critérios de Aceitação:

Pipeline executa em cada push

Todos os jobs passam antes de deploy

Deploy automático para GitHub Pages

Cache acelera builds

Badge de status visível

Notificações de falhas

#Task 8.2: Otimizar Performance e SEO

Prioridade: 🟡 MédiaComplexidade: ⭐⭐ Média

Objetivo: Garantir scores altos no Lighthouse e otimizar para buscadores.

Contexto: Performance impacta diretamente conversão e rankings de busca. Next.js oferece otimizações built-in que devem ser configuradas.

Passos:

Otimizar imagens (Next.js Image, WebP)

Implementar lazy loading

Code splitting (dynamic imports)

Configurar meta tags SEO em todas as páginas

Adicionar sitemap.xml

Implementar structured data (JSON-LD)

Configurar robots.txt

Adicionar analytics (Vercel Analytics ou GA4)

Implementar Service Worker (opcional para PWA)

Testar com Lighthouse e corrigir issues

Meta Tags Essenciais:

<Head>
  <title>Nation.fun - Plataforma de Agentes de IA</title>
  <meta name="description" content="Crie e gerencie agentes de IA autônomos para atendimento em múltiplos canais" />
  <meta property="og:title" content="Nation.fun" />
  <meta property="og:image" content="/og-image.png" />
  <link rel="canonical" href="https://govinda777.github.io/nation.fun/" />
</Head>

Critérios de Aceitação:

Lighthouse Performance > 90

Lighthouse SEO > 95

Lighthouse Accessibility > 90

Imagens otimizadas e lazy loaded

Sitemap e robots.txt configurados

Analytics funcionando

Meta tags em todas as páginas

#FASE 9: Documentação e Testes Finais

#Task 9.1: Criar Documentação Completa

Prioridade: 🟠 AltaComplexidade: ⭐⭐ Média

Objetivo: Documentar toda a plataforma para desenvolvedores e usuários.

Documentos a Criar:

README.md: Overview, setup, tecnologias

CONTRIBUTING.md: Guia de contribuição

docs/USER_GUIDE.md: Manual do usuário

docs/DEVELOPER_GUIDE.md: Guia técnico para devs

docs/API.md: Documentação de APIs

docs/ARCHITECTURE.md: Arquitetura do sistema

docs/DEPLOYMENT.md: Processos de deploy

CHANGELOG.md: Histórico de versões

Critérios de Aceitação:

Todos os documentos criados

Documentação técnica completa e clara

Exemplos de código funcionais

Screenshots e diagramas incluídos

Links internos funcionando

#Task 9.2: Cobertura de Testes Completa

Prioridade: 🔴 CríticaComplexidade: ⭐⭐⭐ Complexa

Objetivo: Garantir cobertura de testes > 80% com testes unitários e BDD.[11][40][10]

Tipos de Testes:

Testes Unitários: Componentes isolados (Jest + React Testing Library)

Testes BDD: Features em Gherkin (Cucumber.js)

Testes de Integração: Fluxos completos (Cypress/Playwright)

Testes E2E: Jornadas de usuário (Cypress/Playwright)

Features BDD Essenciais:

authentication.feature: Todos os fluxos de login

nft-purchase.feature: Compra de Nation Pass

agent-creation.feature: Criação e configuração de agentes

credit-management.feature: Compra e carregamento de créditos

whatsapp-channel.feature: Integração WhatsApp

telegram-channel.feature: Integração Telegram

Critérios de Aceitação:

Cobertura de código > 80%

Todos os cenários BDD implementados

Testes E2E cobrindo fluxos principais

CI/CD executando todos os testes

Documentação de testes atualizada

#🎯 Resumo das Prioridades

#🔴 Críticas (Fazer Primeiro)

Task 0.1 - Análise e documentação estrutura atual

Task 0.2 - Setup ambiente de desenvolvimento

Task 2.1 - Configurar Privy Authentication

Task 3.2 - Integrar interface de chat

Task 4.2 - Implementar compra de NFT

Task 5.2 - Integrar compra de tokens NATION

Task 6.1 - Criar interface criação de agente

Task 8.1 - Configurar CI/CD

Task 9.2 - Cobertura de testes completa

#🟠 Altas (Fazer em Seguida)

Task 1.1 - Criar homepage pública

Task 2.2 - Criar páginas login/registro

Task 3.1 - Criar layout área logada

Task 4.1 - Integrar dados OpenSea

Task 5.1 - Interface gerenciamento créditos

Task 5.3 - Sistema carregamento créditos

Task 6.2 - Editor configuração agente

Task 7.1 - Integrar WhatsApp

Task 7.2 - Integrar Telegram

Task 9.1 - Criar documentação

#🟡 Médias (Fazer Depois)

Task 1.2 - Integrar conteúdo e assets

Task 8.2 - Otimizar performance e SEO

#📚 Recursos e Referências

#Documentação Oficial

Next.js: https://nextjs.org/docs

Privy: https://docs.privy.io

OpenSea API: https://docs.opensea.io

WhatsApp Business API: https://developers.facebook.com/docs/whatsapp

Telegram Bot API: https://core.telegram.org/bots/api

Base Blockchain: https://docs.base.org

Cucumber.js: https://cucumber.io/docs/installation/javascript

#Repositórios de Referência

Projeto Atual: https://github.com/govinda777/nation.fun

Projeto Exemplo (govinda_systems_bot): https://github.com/govinda777/govinda_systems_bot

OpenSea Nation Pass: https://opensea.io/collection/nation-pass-alpha

#Tecnologias Stack

Frontend: Next.js 14+, React 18+, TypeScript, Tailwind CSS

Autenticação: Privy SDK

Blockchain: ethers.js/viem, Base network

Testes: Jest, React Testing Library, Cucumber.js, Cypress

Deploy: GitHub Actions, GitHub Pages

APIs: Next.js API Routes, REST

Banco de Dados: PostgreSQL/Supabase (sugestão)

#🎓 Próximos Passos

Revisar este documento com toda a equipe

Priorizar tarefas de acordo com recursos disponíveis

Criar issues no GitHub para cada tarefa

Definir sprints (sugestão: sprints de 2 semanas)

Iniciar pela Fase 0 (estrutura e fundação)

Documentar decisões técnicas no repositório

Configurar board Kanban (GitHub Projects)

Realizar daily standups para acompanhamento

Elaborado por: Especialista em Engenharia de Software Nation PlatformData: 31 de Outubro de 2025Versão: 1.0

Este roadmap está estruturado para ser executado de forma incremental e iterativa, priorizando entregas de valor e mantendo o código sempre deployável. Cada tarefa possui contexto claro, conceitos explicados e critérios de aceitação mensuráveis.

1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40
