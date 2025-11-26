# Variáveis de Ambiente

Este documento descreve todas as variáveis de ambiente necessárias para rodar e desenvolver este projeto.

## Visão Geral

Utilizamos variáveis de ambiente para gerenciar configurações sensíveis e específicas de cada ambiente (desenvolvimento local, teste, produção). Isso nos permite ter uma base de código limpa e segura, sem expor chaves privadas ou endereços de contrato fixos no código.

O arquivo principal para configurar suas variáveis é o `.env.local`. Você pode criá-lo a partir do modelo fornecido no arquivo `.env.example`.

```bash
cp .env.example .env.local
```

## Configuração para Desenvolvimento Local (Hardhat)

Para desenvolver o frontend apontando para uma blockchain local do Hardhat, use as seguintes variáveis no seu arquivo `.env.local`.

### Variáveis

-   **`HARDHAT_PRIVATE_KEY_DEPLOYER`**
    -   **Descrição:** A chave privada da conta usada para fazer o deploy dos contratos de teste (mocks) na rede Hardhat.
    -   **Obrigatória:** Sim (para o script de deploy).
    -   **Exemplo:** `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
    -   **⚠️ Aviso:** Esta é uma chave de teste padrão do Hardhat. **Nunca** use uma chave de carteira real aqui.

-   **`NEXT_PUBLIC_CHAIN_ID`**
    -   **Descrição:** O ID da blockchain que o frontend irá usar. Para a rede local do Hardhat, o padrão é `31337`.
    -   **Obrigatória:** Sim.
    -   **Exemplo:** `31337`

-   **`NEXT_PUBLIC_RPC_URL`**
    -   **Descrição:** A URL do nó RPC ao qual o frontend irá se conectar.
    -   **Obrigatória:** Sim.
    -   **Exemplo:** `http://127.0.0.1:8545`

-   **`NEXT_PUBLIC_NATO_TOKEN_ADDRESS`**
    -   **Descrição:** O endereço do contrato de teste (mock) para o token `$NATO`.
    -   **Obrigatória:** Sim.
    -   **Como obter:** Este valor será preenchido automaticamente ao rodar o script de deploy do Hardhat.

-   **`NEXT_PUBLIC_GOVI_COIN_ADDRESS`**
    -   **Descrição:** O endereço do contrato de teste (mock) para a `Govindas Coin`.
    -   **Obrigatória:** Sim.
    -   **Como obter:** Este valor será preenchido automaticamente ao rodar o script de deploy do Hardhat.

-   **`NEXT_PUBLIC_NFT_COLLECTION_ADDRESS`**
    -   **Descrição:** O endereço do contrato de teste (mock) para a coleção de NFTs.
    -   **Obrigatória:** Sim.
    -   **Como obter:** Este valor será preenchido automaticamente ao rodar o script de deploy do Hardhat.

## Fluxo de Desenvolvimento Local

1.  **Copie o Exemplo:**
    ```bash
    cp .env.example .env.local
    ```
2.  **Inicie o Nó Hardhat:**
    Em um terminal, rode o seguinte comando na pasta `hardhat/`:
    ```bash
    npx hardhat node
    ```
3.  **Faça o Deploy dos Mocks:**
    Em outro terminal, rode o script de deploy (que ainda será criado):
    ```bash
    npx hardhat run scripts/deploy-mocks.js --network localhost
    ```
    Este script irá preencher os endereços dos contratos no seu terminal. Copie e cole esses valores no seu arquivo `.env.local`.

4.  **Inicie o Frontend:**
    Com o nó Hardhat rodando e o `.env.local` configurado, inicie o servidor de desenvolvimento do Next.js:
    ```bash
    npm run dev
    ```
    O aplicativo agora estará conectado à sua blockchain local do Hardhat.
