# 📋 Documentação de Endereços de Crypto Assets - Nation.fun

## 1. Visão Geral do Projeto

O **Nation.fun** é uma plataforma para criação, deploy e monetização de agentes autônomos de IA (AI agents). O projeto utiliza contratos inteligentes na blockchain para gerenciar tokens e NFTs que fazem parte do ecossistema.[1]

## 2. Tokens ERC-20 do Projeto

### 2.1 NatoCoin ($NATO)

**Informações do Contrato:**
- **Nome:** Nato Coin
- **Símbolo:** NATO
- **Padrão:** ERC-20
- **Decimais:** 18
- **Supply Inicial:** 1.000.000 tokens
- **Arquivo do Contrato:** `hardhat/contracts/NatoCoin.sol`

**Endereços por Ambiente:**

| Ambiente | Endereço do Contrato | Descrição |
|----------|---------------------|-----------|
| **Hardhat Local** | A ser definido após deploy | Rede de desenvolvimento local |
| **Testnet/Mainnet** | A ser configurado | Redes públicas |

**Variável de Ambiente:**
```bash
NEXT_PUBLIC_NATO_TOKEN_ADDRESS=<endereço_após_deploy>
```

**Características:**
- Token ERC-20 padrão baseado em OpenZeppelin
- Utilizado como moeda principal no ecossistema Nation.fun para desenvolvimento local
- Todos os tokens são mintados para o deployer no momento da criação do contrato[1]

***

### 2.2 Govindas Coin ($GVC)

**Informações do Contrato:**
- **Nome:** Govindas Coin
- **Símbolo:** GVC
- **Padrão:** ERC-20
- **Decimais:** 18
- **Supply Inicial:** 1.000.000 tokens
- **Arquivo do Contrato:** `hardhat/contracts/GovindasCoin.sol`

**Endereços por Ambiente:**

| Ambiente | Endereço do Contrato | Descrição |
|----------|---------------------|-----------|
| **Hardhat Local** | A ser definido após deploy | Rede de desenvolvimento local |
| **Testnet/Mainnet** | A ser configurado | Redes públicas |

**Variável de Ambiente:**
```bash
NEXT_PUBLIC_GOVI_COIN_ADDRESS=<endereço_após_deploy>
```

**Características:**
- Token de utilidade e recompensa no ecossistema Nation.fun
- Baseado no contrato ERC-20 da OpenZeppelin
- Supply fixo de 1 milhão de tokens mintados no deploy[1]

***

## 3. NFT Collections (ERC-721)

### 3.1 MockERC721 (MockNFT)

**Informações do Contrato:**
- **Nome:** MockNFT
- **Símbolo:** MNFT
- **Padrão:** ERC-721
- **Arquivo do Contrato:** `hardhat/contracts/MockERC721.sol`

**Endereços por Ambiente:**

| Ambiente | Endereço do Contrato | Descrição |
|----------|---------------------|-----------|
| **Hardhat Local** | A ser definido após deploy | Rede de desenvolvimento local |
| **Testnet/Mainnet** | A ser configurado | Redes públicas |

**Variável de Ambiente:**
```bash
NEXT_PUBLIC_NFT_COLLECTION_ADDRESS=<endereço_após_deploy>
```

**Características:**
- NFT utilizado para fins de teste no ecossistema
- Apenas o owner do contrato pode criar novos NFTs (função `safeMint`)
- Baseado nos contratos ERC721 e Ownable da OpenZeppelin[1]

***

## 4. Contratos Avançados

### 4.1 CashbackPaymaster

**Informações do Contrato:**
- **Arquivo do Contrato:** `hardhat/contracts/CashbackPaymaster.sol`
- **Propósito:** Implementação de funcionalidade de cashback para transações

**Endereço:**
- A ser definido após deploy

***

## 5. Tokens de Referência Externa

### 5.1 Nation3 DAO Token ($NATION)

O projeto Nation.fun faz referência ao ecossistema Nation3, que possui seu próprio token:

**Informações do Token:**
- **Nome:** NATION
- **Rede:** Ethereum Mainnet
- **Endereço do Contrato:** `0x333a4823466879eef910a04d473505da62142069`
- **Supply Máximo:** 42.069 tokens (não mintável)
- **Decimais:** 18
- **Padrão:** ERC-20[2][3]

**Características:**
- Token de governança do Nation3 DAO
- Requerido para mintar passaportes NFT e tornar-se cidadão do Nation3
- Usado para staking em $veNATION[2]

**Explorer:**
- Etherscan: https://etherscan.io/address/0x333a4823466879eef910a04d473505da62142069[4]

***

## 6. Configuração de Ambiente

### 6.1 Arquivo .env.example

O projeto fornece um template de configuração em `.env.example`:

```bash
# Hardhat/Local Development Configuration
HARDHAT_PRIVATE_KEY_DEPLOYER=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Chain ID para rede Hardhat local
NEXT_PUBLIC_CHAIN_ID=31337

# RPC URL para rede Hardhat local
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

# Endereços dos Contratos Mock (populados após deploy)
NEXT_PUBLIC_NATO_TOKEN_ADDRESS=
NEXT_PUBLIC_GOVI_COIN_ADDRESS=
NEXT_PUBLIC_NFT_COLLECTION_ADDRESS=
```

***

## 7. Scripts de Deploy

### 7.1 Deploy de Todos os Contratos

**Arquivo:** `hardhat/scripts/deploy-all.js`

Este script realiza o deploy de todos os contratos do projeto.

### 7.2 Deploy de Contratos Mock

**Arquivo:** `hardhat/scripts/deploy-mocks.js`

**Funcionalidades:**
1. Deploy dos contratos NatoCoin, GovindasCoin e MockERC721
2. Criação de uma carteira de teste com 1 ETH
3. Distribuição inicial de assets:
   - 100 $NATO para a carteira de teste
   - 500 $GVC para a carteira de teste
   - 2 NFTs (IDs 1 e 2) para a carteira de teste
4. Geração de private key para importação no MetaMask[1]

**Como executar:**
```bash
cd hardhat
npx hardhat run scripts/deploy-mocks.js --network localhost
```

***

## 8. Redes Suportadas

### 8.1 Desenvolvimento Local

| Parâmetro | Valor |
|-----------|-------|
| **Rede** | Hardhat |
| **Chain ID** | 31337 |
| **RPC URL** | http://127.0.0.1:8545 |

### 8.2 Redes Públicas

O projeto é compatível com:
- **Ethereum Mainnet**
- **Base** (Layer 2)
- **Polygon**
- Outras redes EVM-compatíveis[1]

***

## 9. Carteiras de Teste

### 9.1 Carteira do Deployer (Hardhat)

```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Endereço: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

⚠️ **AVISO:** Esta chave é APENAS para desenvolvimento local. NUNCA use em produção ou com ativos reais.

### 9.2 Carteira de Teste Gerada

Ao executar o script `deploy-mocks.js`, uma nova carteira é criada automaticamente com:
- 1 ETH para taxas de gas
- 100 $NATO
- 500 $GVC
- 2 NFTs (IDs 1 e 2)

A private key é exibida no console após o deploy para importação no MetaMask.[1]

***

## 10. Tabela Resumo de Assets

| Asset | Tipo | Símbolo | Supply | Endereço (Local) | Variável de Ambiente |
|-------|------|---------|--------|------------------|----------------------|
| Nato Coin | ERC-20 | NATO | 1.000.000 | TBD | `NEXT_PUBLIC_NATO_TOKEN_ADDRESS` |
| Govindas Coin | ERC-20 | GVC | 1.000.000 | TBD | `NEXT_PUBLIC_GOVI_COIN_ADDRESS` |
| MockNFT | ERC-721 | MNFT | Variável | TBD | `NEXT_PUBLIC_NFT_COLLECTION_ADDRESS` |
| Nation3 Token | ERC-20 | NATION | 42.069 | 0x333a...2069 (Ethereum) | N/A |

***

## 11. Auditoria e Segurança

### 11.1 Contratos Base

Todos os contratos do projeto utilizam bibliotecas auditadas da **OpenZeppelin**:
- ERC20
- ERC721
- Ownable
- SafeMath (implícito em versões Solidity ^0.8.x)

### 11.2 Nation3 Token

O token $NATION do Nation3 DAO foi auditado por:
- **GoldmanDAO** 
- Baseado em código do Solmate, previamente auditado por Fixed Point e utilizado pelo Olympus ($OHM)[2]

***

## 12. Como Obter os Endereços Após Deploy

### Passo 1: Execute o Deploy Local
```bash
cd hardhat
npm install
npx hardhat node
```

### Passo 2: Em Outro Terminal, Execute o Script de Deploy
```bash
npx hardhat run scripts/deploy-mocks.js --network localhost
```

### Passo 3: Copie os Endereços
O script irá exibir algo como:
```
NatoCoin deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
GovindasCoin deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
MockERC721 (NFT) deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

Please copy the following lines into your .env.local file:
--------------------------------------------------
NEXT_PUBLIC_NATO_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_GOVI_COIN_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_NFT_COLLECTION_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
--------------------------------------------------
```

### Passo 4: Configure o Arquivo .env.local
Crie um arquivo `.env.local` na raiz do projeto e adicione as variáveis acima.[1]

***

## 13. Integração com Frontend

O frontend Next.js do projeto consome os endereços dos contratos através das variáveis de ambiente:

```javascript
// Exemplo de uso no código
const natoTokenAddress = process.env.NEXT_PUBLIC_NATO_TOKEN_ADDRESS;
const gvcTokenAddress = process.env.NEXT_PUBLIC_GOVI_COIN_ADDRESS;
const nftAddress = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS;
```

***

## 14. Exploradores de Blockchain

Para visualizar transações e contratos:

### Desenvolvimento Local
- Hardhat Console: Logs no terminal onde o node está rodando

### Redes Públicas
- **Ethereum:** https://etherscan.io
- **Base:** https://basescan.org
- **Polygon:** https://polygonscan.com

***

## 15. Recursos Adicionais

### Documentação do Projeto
- **Site Principal:** https://nationfun.vercel.app/
- **Documentação:** https://govinda777.github.io/nation.fun/
- **Repositório GitHub:** https://github.com/govinda777/nation.fun/

### Nation3 DAO
- **Website:** https://nation3.org
- **Wiki:** https://wiki.nation3.org/
- **Token Info:** https://wiki.nation3.org/token/[2]

### Comunidade
- **Discord:** https://discord.gg/nation
- **Twitter:** @nationfun
- **Email:** support@nation.fun

***

## 16. Checklist de Deploy

- [ ] Clonar o repositório
- [ ] Instalar dependências (`npm install` na raiz e em `hardhat/`)
- [ ] Configurar arquivo `.env` com private keys apropriadas
- [ ] Iniciar nó Hardhat local (`npx hardhat node`)
- [ ] Executar script de deploy (`npx hardhat run scripts/deploy-mocks.js --network localhost`)
- [ ] Copiar endereços dos contratos para `.env.local`
- [ ] Importar carteira de teste no MetaMask usando a private key fornecida
- [ ] Adicionar tokens e NFTs ao MetaMask usando os endereços dos contratos
- [ ] Iniciar aplicação Next.js (`npm run dev`)
- [ ] Testar funcionalidades no navegador

***

## 17. Troubleshooting

### Problema: Endereços não aparecem após deploy
**Solução:** Certifique-se de que o nó Hardhat está rodando antes de executar o script de deploy.

### Problema: Transações falhando no MetaMask
**Solução:** 
1. Verifique se o MetaMask está conectado à rede correta (localhost:8545)
2. Reset das contas no MetaMask (Settings > Advanced > Reset Account)
3. Certifique-se de ter ETH suficiente para gas

### Problema: Tokens não aparecem no MetaMask
**Solução:** 
1. Adicione o token manualmente usando "Import Token"
2. Cole o endereço do contrato do token
3. O símbolo e decimais devem ser preenchidos automaticamente

***

## 📝 Notas Finais

Esta documentação cobre todos os endereços de cripto assets identificados no projeto Nation.fun. Para informações atualizadas sobre deployments em redes públicas (testnets ou mainnet), consulte:

1. O arquivo `README.md` do repositório
2. A documentação oficial em https://govinda777.github.io/nation.fun/
3. Os arquivos de configuração em `docs/env-variables.md`

Para contribuir com o projeto ou reportar issues, visite o repositório GitHub em https://github.com/govinda777/nation.fun/.

***

**Última Atualização:** 27 de novembro de 2025  
**Versão do Documento:** 1.0

[1](https://nation.fun/agent/0x749E4f43c05a8dC67d84CC3341e1E774c7c43a8c?chat=true)
[2](https://wiki.nation3.org/token/)
[3](https://web3.bitget.com/en/dapp/nation3-26495)
[4](https://etherscan.io/address/0x333a4823466879eef910a04d473505da62142069)
[5](https://github.com/bernardladenthin/BitcoinAddressFinder)
[6](https://www.youtube.com/watch?v=36n-OfZcw3g)
[7](https://www.binance.com/en/price/funtoken)
[8](https://github.com/topics/bitcoin-address)
[9](https://auth0.com/blog/101-smart-contracts-and-decentralized-apps-in-ethereum/)
[10](https://coinmarketcap.com/currencies/funtoken/)
[11](https://github.com/topics/bitcoin-addresses)
[12](https://www.coinbase.com/price/funtoken)
[13](https://github.com/topics/bitcoin-address?l=python&o=desc&s=updated)
[14](https://nation.fun/agent/0x6342f2211FeF53D8E37a09Ab8BD2E43b2e0a485C?chat=true)
[15](https://nation.fun/agent/0xc83e87f05a582104969B6F0Db1ce71bf2EC9233b?chat=true)
[16](https://nation.fun/agent/0x668027864C3cbBFE23d4a10aCad67b9CaFD74884?chat=true)
[17](https://wiki.nation3.org/passport/)
[18](https://etherscan.io/token/0x7613c48e0cd50e42dd9bf0f6c235063145f6f8dc)
[19](https://web3.bitget.com/vi/dapp/nation3-26495)
[20](https://www.binance.com/en/price/the-nation-token)
[21](https://www.livecoinwatch.com/price/Nation3-NATION)
[22](https://github.com/nation3)
[23](https://basescan.org/token/0xd968196fa6977c4e58f2af5ac01c655ea8332d22?a=0x83c90e3b20e6d299a1807277d3f3a7dab186eade)
[24](https://coinpaprika.com/coin/nation-nation3/)
[25](https://etherscan.io/token/0x419d0d8bdd9af5e606ae2232ed285aff190e711b)
[26](https://www.canada.ca/en/financial-consumer-agency/services/payment/digital-currency.html)
[27](https://funtoken.io)
[28](https://www.asic.gov.au/regulatory-resources/digital-transformation/digital-assets-financial-products-and-services/)
[29](https://support.metamask.io/pt-br/manage-crypto/tokens/how-to-find-a-token-contract-address/)
[30](https://www.pwc.com/us/en/tech-effect/emerging-tech/understanding-cryptocurrency-digital-assets.html)
[31](http://www.fca.org.uk/publication/consultation/cp25-25.pdf)
[32](https://ethplorer.io/address/0xe1baf79400f20b6ecffe4a92bca591e893120856)
[33](https://unstats.un.org/unsd/nationalaccount/RAdocs/F18_GN_Recording_Crypto_Assets.pdf)
