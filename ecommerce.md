# Guia Completo: Agente de E-Commerce Autônomo na Plataforma Nation com Pagamentos USDC via x402

## Visão Geral

Criei um **framework completo** para construir um agente de e-commerce autônomo na plataforma Nation com capacidades nativas de gerenciamento de catálogo, processamento de pedidos, pagamentos em USDC sem taxas e auditoria on-chain. A solução integra:

- **Plataforma Nation**: Agentes autônomos de IA com suporte a múltiplas skills
- **Protocolo x402**: Pagamentos HTTP-nativas com USDC instantâneo
- **Blockchain Base**: Layer 2 Ethereum otimizada para micropagamentos
- **CDP Facilitador**: Serviço hosted da Coinbase para verificação de pagamentos

***

## Panorama de Opções de Pagamento

### 1. **USDC Mainnet (Recomendado)**

| Característica | Detalhe |
|---|---|
| **Blockchain** | Base (Coinbase L2) |
| **Token** | USD Coin (EIP-3009 compatible) |
| **Taxa de Protocolo** | 0% (zero) |
| **Tempo de Liquidação** | <2 segundos |
| **Custo por Transação** | ~$0.0001 |
| **Facilitador** | CDP Facilitator (Coinbase) |
| **Status** | Production-ready |

**Vantagens**: Sem taxas, pagamentos instantâneos, estável, suporte Coinbase

### 2. **USDC Base Sepolia (Testnet)**

- Faucet gratuito para testes
- Facilitador: x402.org (community)
- Zero custos reais
- Perfeito para desenvolvimento

### 3. **Outros Tokens EIP-3009**

Qualquer token que implemente EIP-3009 é suportado (EURC, CBDCs futuras, tokens customizados)

### 4. **Solana SPL Tokens**

Se usar Solana: todos os tokens SPL e Token-2022 são suportados

***

## Skills Nativas da Nation Recomendadas

### **Skill 1: Catalog Manager**
- **Função**: Gerenciar e apresentar catálogo de produtos
- **Operações**: Listar, filtrar, buscar produtos; exibir preços em USDC e estoque
- **Tipo**: Data Query & Retrieval
- **Permissões**: Read-only

### **Skill 2: Order Processor**
- **Função**: Validar e registrar pedidos
- **Operações**: Validar estoque, calcular totais, gerar ORDER_ID, reservar items
- **Tipo**: State Management & Validation
- **Permissões**: Write (criar pedidos), Read (dados)

### **Skill 3: Payment Processor**
- **Função**: Processar pagamentos USDC via x402
- **Operações**: Initiate x402 request, verify payment signature, manage settlement
- **Integração**: x402 Protocol (Base mainnet/testnet)
- **Permissões**: Verificar pagamentos, criar recibos

### **Skill 4: Audit Manager**
- **Função**: Registrar todas as transações on-chain
- **Operações**: Log imutável, validar integridade, gerar relatórios, detectar anomalias
- **Storage**: Smart Contract + Database (write-append only)
- **Permissões**: Indefinida (auditoria permanente)

***

## Passo a Passo de Configuração

### **Fase 1: Preparação Inicial (Testnet)**

1. **Criar carteira e obter USDC de teste**
   - Criar carteira EVM no MetaMask
   - Adicionar rede Base Sepolia
   - Obter testnet ETH (faucet Sepolia)
   - Obter testnet USDC (faucets.circle.com)

2. **Criar agente na Nation**
   - Acessar https://nation.fun
   - Conectar carteira MetaMask
   - "Create Agent" com nome e descrição
   - Nation gera carteira nativa do agente

3. **Configurar Skills do Agente**```
   Skill 1: Catalog Manager (API: /api/catalog)
   Skill 2: Order Processor (API: /api/orders)
   Skill 3: Payment Processor (API: /api/payment/process)
   Skill 4: Audit Manager (API: /api/audit)
   ```

### **Fase 2: Backend com x402**

```bash
npm install express @coinbase/x402 x402-express ethers dotenv
```

**Configurar middleware x402:**
```javascript
app.use(
  paymentMiddleware(
    process.env.AGENT_WALLET_ADDRESS,
    {
      "POST /api/payment/process": {
        price: "$0.001",
        network: "base-sepolia",
      },
    },
    { facilitator }
  )
);
```

### **Fase 3: Implementar Endpoints**

- `GET /api/catalog` - Listar produtos
- `POST /api/orders` - Criar pedido
- `POST /api/payment/process` - Processar pagamento (x402)
- `GET /api/audit` - Consultar logs

### **Fase 4: Deploy para Produção**

1. Migrar Base Sepolia → Base Mainnet
2. Configurar CDP API Keys para mainnet
3. Transferir USDC real para carteira do agente
4. Testar com transações pequenas ($1-5)
5. Ativar monitoramento e alertas

***

## Exemplos Práticos de Interações

### **Exemplo 1: Cliente Consulta Catálogo**

**Cliente**: "Mostre-me laptops disponíveis"

**Agente (retorna via skill CATALOG):**
```
Encontrei 2 laptops:

📱 1. Laptop Premium 15"
   Preço: 1,200.00 USDC
   Processador: Intel i7, RAM: 16GB
   Estoque: 5 unidades

📱 2. Laptop Ultrabook 13"
   Preço: 899.99 USDC
   Processador: Intel i5, RAM: 8GB
   Estoque: 3 unidades
```

### **Exemplo 2: Cliente Cria Pedido**

**Cliente**: "Quero 1 Laptop Premium e 2 Mouse Wireless"

**Agente (skill ORDER_PROCESSOR):**
```
✓ Pedido criado: ORD-20251030-001

┌──────────────────────────────┐
│ Laptop Premium      1  $1,200 │
│ Mouse Wireless      2  $71.00 │
├──────────────────────────────┤
│ Subtotal:              $1,271 │
│ Frete:                   $25  │
│ TOTAL:  1,296.00 USDC (final) │
└──────────────────────────────┘

💳 Autorize pagamento x402
```

### **Exemplo 3: Pagamento via x402**

**Fluxo automático (HTTP 402):**
1. Agente envia HTTP 402 "Payment Required"
2. Cliente assina transação USDC em carteira
3. Transação enviada ao blockchain Base
4. CDP Facilitator verifica (~200ms)
5. Servidor confirma pedido

**Agente (skill PAYMENT):**
```
✓ Pagamento confirmado!

📋 Recibo de Transação
├─ Pedido: ORD-20251030-001
├─ Valor: 1,296.00 USDC
├─ TX Hash: 0xabc123def456...
├─ Blockchain: Base Mainnet
├─ Confirmações: 12 (finalizado)
└─ Link: https://basescan.org/tx/0xabc123...
```

### **Exemplo 4: Auditoria On-Chain (skill AUDIT)**

**Cliente**: "Mostrar auditoria do pedido ORD-20251030-001"

```
📊 Log Imutável no Blockchain

23:25:00 UTC [INFO] Pedido criado
           └─ Total: 1,296.00 USDC

23:28:30 UTC [PAYMENT] x402 requisição enviada
           └─ HTTP 402 Payment Required

23:29:15 UTC [BLOCKCHAIN] Transação confirmada
           └─ TX: 0xabc123def456...
           └─ Block: 12345678
           └─ Value: 1,296.00 USDC

23:29:45 UTC [VERIFIED] Pagamento verificado
           └─ 12 confirmações ✓

23:30:00 UTC [COMPLETED] Pedido finalizado
           └─ Receipt: REC-20251030-001
           └─ Status: COMPLETED
```

***

## Arquivos Entregues

### 1. **Guia PDF (23 páginas)**
Documento completo com:
- Visão geral arquitetura
- Opções de pagamento suportadas
- Skills nativas da Nation (detalhado)
- Passo a passo configuração (testnet + produção)
- Exemplos práticos de interação
- Segurança e compliance
- Troubleshooting

### 2. **Aplicativo Interativo (Demo)**
Interface web funcional que demonstra:
- Navegação por catálogo de produtos
- Carrinho de compras
- Fluxo de checkout
- Simulação de pagamento x402 (com delays realistas)
- Confirmação com recibo
- Histórico de pedidos
- Explicação do protocolo x402

### 3. **Exemplos de Código (Markdown)**
Pronto para implementação:
- Backend Express.js completo com x402
- Cliente Next.js com Web3
- Hook de assinatura USDC (EIP-712)
- Smart Contract de Auditoria (Solidity)
- Arquivo .env de configuração
- Exemplos de cURL para testar API

***

## Segurança & Compliance

### **Wallet Security**
```javascript
// Criptografia de chave privada
encryptPrivateKey(privateKey) → encrypted
// Recomendado: usar CDP Wallet (custodial)
```### **Payment Validation**
1. Verificar assinatura USDC
2. Validar valor e endereço
3. Verificar timestamp (não expirado)
4. Confirmar on-chain via facilitador

### **Compliance (KYC/AML)**
- Integrar com Onfido para KYC
- Verificar lista OFAC
- Implementar limites por cliente

***

## Tecnologias Suportadas

| Componente | Tecnologia | Detalhe |
|---|---|---|
| **Agente** | Nation.fun | Plataforma autônoma |
| **Blockchain** | Base L2 | Ethereum camada 2 |
| **Pagamento** | x402 | HTTP 402 + USDC |
| **Facilitador** | CDP (Coinbase) | Zero taxas |
| **Backend** | Node.js/Express | Middleware x402 |
| **Frontend** | React/Next.js | Web3 integration |
| **Smart Contracts** | Solidity | Auditoria on-chain |
| **Wallet** | MetaMask | Cliente EVM |

***

## Próximos Passos Recomendados

1. ✅ **Testnet (1-2 semanas)**
   - Setup ambiente de desenvolvimento
   - Implementar as 4 skills
   - Testar fluxo completo de pedido
   - Validar x402 integration

2. ✅ **Produção (2-4 semanas)**
   - Migrar Base Sepolia → Base Mainnet
   - Configurar CDP API Keys mainnet
   - Deploy em produção
   - Começar com USDC pequenos valores

3. ✅ **Escala (ongoing)**
   - Monitoramento 24/7
   - Rate limiting e segurança
   - Caching de catálogo
   - Multi-threading para pagamentos

***

## Resumo Executivo

Você agora tem um **blueprint completo** para construir um agente de e-commerce que:

- 🤖 **Funciona 24/7** sem intermediários
- 💰 **Aceita pagamentos em USDC** sem taxas (x402)
- 📦 **Gerencia catálogo e estoque** automaticamente
- ✅ **Valida pagamentos** em ~200ms no blockchain Base
- 📊 **Registra tudo on-chain** para total rastreabilidade
- 🔒 **Seguro e audível** com smart contracts

O agente pode ser deployado hoje em Base Sepolia (testnet) e escalado para produção em Base Mainnet com USDC real!

Fontes
[1] Bazaar (Discovery Layer) | x402 https://x402.gitbook.io/x402/core-concepts/bazaar-discovery-layer
[2] Nation | Autonomous AI agents https://nation.fun/agent/0x668027864C3cbBFE23d4a10aCad67b9CaFD74884?chat=true
[3] E-Commerce Nation | eTail Palm Springs https://etailwest.wbresearch.com/mediapartners/e-commerce-nation
[4] Blockchain for Payments in 2025 https://www.scnsoft.com/blockchain/payments
[5] EU Skills Profile Tool for Third Country Nationals https://employment-social-affairs.ec.europa.eu/policies-and-activities/skills-and-qualifications/skills-jobs/eu-skills-profile-tool-third-country-nationals_en
[6] eCommerce Nation - eTail Germany https://etailgermany.wbresearch.com/mediapartners/ecommerce-nation
[7] x402: Revolutionizing How AI Agents Pay for Services https://www.youtube.com/watch?v=UQJl8jCDMlo
[8] What's NSP - NSP PAK https://pnsp.pk/what_nsp/
[9] NATION Agency https://digitalagencynetwork.com/agency/nation/
[10] Blockchain in Payments | Blockchain Use Cases https://www.leewayhertz.com/blockchain-in-payments/
[11] Skill Nation – Be Future Ready, Today! https://skillnation.ai
[12] Viral Nation: The Global Leader in Social Media ... https://www.viralnation.com
[13] Autonomous Agents in Action: Multi-Industry Applications ... https://www.accelirate.com/autonomous-agents/
[14] Blockchain and AI Agents for Transparent Supply Chains https://www.auxiliobits.com/blog/blockchain-integration-with-ai-agents-for-supply-chain-transparency/
[15] Product Catalog Management software for eCommerce & ... https://www.n41.com/product-catalog-management/
[16] Autonomous Agents: Building the Future ... https://www.automationanywhere.com/rpa/autonomous-agents
[17] 9 best cryptocurrency payment gateways for international ... https://bvnk.com/blog/best-crypto-payment-gateway
[18] Easy Product Inventory Management and Catalogs https://www.catalogmachine.com/inventory-management
[19] What are autonomous agents? https://www.servicenow.com/uk/ai/what-are-autonomous-agents.html
[20] Blockchain for Global Payments: Use Cases and Benefits https://scand.com/company/blog/blockchain-in-payments/
[21] Catalog Management: Best Practices, Solutions, and ... https://www.plytix.com/blog/catalog-management
[22] What are Autonomous Agents? A Complete Guide https://www.salesforce.com/agentforce/ai-agents/autonomous-agents/
[23] Agent configuration https://documentation.fusioninventory.org/FusionInventory_agent/configuration/configuration/
[24] AI Agents in Skills Training: Proven, Powerful Gains https://digiqt.com/blog/ai-agents-in-skills-training/
[25] Circle Enables AI Agents to Pay for Online Services Using ... https://finance.yahoo.com/news/circle-enables-ai-agents-pay-171727075.html
[26] fusioninventory-agent https://documentation.fusioninventory.org/FusionInventory_agent/manpage/fusioninventory-agent/
[27] AI Agent Tool Integration Implementation Guide https://zenvanriel.nl/ai-engineer-blog/ai-agent-tool-integration-guide/
[28] Enabling AI Agents with Blockchain https://www.circle.com/blog/enabling-ai-agents-with-blockchain
[29] How to Build Autonomous Trading Agents with Nation.fun https://www.youtube.com/watch?v=-WMDz1nT9q0
[30] Tools & Integration https://docs.agent.ai/knowledge-agents/tools-integration
[31] AI agents can now pay APIs with USDC in 200 ms as ... https://cryptoslate.com/ai-agents-can-now-pay-apis-with-usdc-in-200-ms-as-coinbase-activates-x402-bazaar/
[32] Manual Installation—Windows Agent https://documentation.n-able.com/remote-management/userguide/Content/manual_installation2.htm
[33] tmgthb/Autonomous-Agents https://github.com/tmgthb/Autonomous-Agents
[34] How to build an AI Commerce Agent on WhatsApp for ... https://www.youtube.com/watch?v=ymqoqbA8Vhg
[35] Embrace the Fun: FUN Token Integration https://nowpayments.io/blog/embrace-the-fun
[36] HeyNina101/ai-agent-starter-kit https://github.com/HeyNina101/ai-agent-starter-kit
[37] Create AI Chat Agent for WooCommerce with n8n https://www.youtube.com/watch?v=OtJNMP-bsuU
[38] What Is FUNToken? All You Need to Know About FUN https://www.gate.com/learn/articles/what-is-funtoken/781
[39] I created a 100% AUTONOMOUS AI Agent with MCP in ... https://www.youtube.com/watch?v=0zuRil7M7IY
[40] Building an AI-Powered E-commerce Chat Assistant with ... https://www.youtube.com/watch?v=9tANiA0LKn4
[41] Leveraging tokenisation for payments and financial ... https://www.bis.org/publ/othp92.pdf
[42] Nation | Autonomous AI agents https://nation.fun/agent/0xba9FEb3A55694f556bB3BA8bbfafaE2b3B37B5d1
[43] Network & Token Support | x402 https://x402.gitbook.io/x402/core-concepts/network-and-token-support
[44] Quickstart for Sellers | x402 https://x402.gitbook.io/x402/getting-started/quickstart-for-sellers
[45] What is x402? https://blog.crossmint.com/what-is-x402/
[46] Facilitator - Coinbase Developer Documentation https://docs.cdp.coinbase.com/x402/core-concepts/facilitator
[47] X402 Protocol: The HTTP-native Payment Standard for ... https://blockeden.xyz/blog/2025/10/26/x402-protocol-the-http-native-payment-standard-for-autonomous-ai-commerce/
[48] Welcome to x402 - Coinbase Developer Documentation https://docs.cdp.coinbase.com/x402/welcome
[49] Quickstart for Sellers - Coinbase Developer Documentation https://docs.cdp.coinbase.com/x402/quickstart-for-sellers
[50] Launch AI Agents on Base https://docs.base.org/cookbook/launch-ai-agents
[51] Enabling Machine-to-Machine Micropayments with ... https://www.circle.com/blog/enabling-machine-to-machine-micropayments-with-gateway-and-usdc
[52] Network & Token Support - x402 https://docs.cdp.coinbase.com/x402/network-support
[53] Kite AI, Building the Blockchain Rails for Agentic Payments https://x.com/Xangle_official/status/1973645616149570043
[54] What Is X402? A Beginner's Guide to the AI Payment ... https://www.kucoin.com/blog/en-what-is-x402-a-beginner-s-guide-to-the-ai-payment-revolution
