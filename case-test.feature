# Testes BDD Detalhados - Todas as Skills Nation.fun

## Índice de Skills
1. **Walletactionprovider get wallet details** ⭐ (Requer Nation Pass)
2. **Token price**
3. **Token search**
4. **Token analytics**
5. **Token erc20 transfers**
6. **Tavily search**
7. **Walletactionprovider native transfer** ⭐ (Requer Nation Pass)
8. **Http get**
9. **Http put**
10. **Http post**
11. **Pyth fetch price**

---

## 1. Walletactionprovider Get Wallet Details ⭐

**Localização**: `features/public-skills/wallet-details.feature`

```gherkin
Feature: Consulta de detalhes da carteira
  Como um usuário autenticado com Nation Pass
  Eu quero consultar detalhes de uma carteira
  Para visualizar saldo, tokens e histórico de transações

  Background:
    Given o agente possui Nation Pass válido
    And o sistema está conectado à rede blockchain

  @smoke @wallet @critical
  Scenario: Consulta bem-sucedida de carteira com saldo
    Given uma carteira com endereço "0x1234567890abcdef1234567890abcdef12345678"
    And a carteira contém saldo de "5.5" ETH
    And a carteira contém "3" tokens diferentes
    When eu solicito os detalhes da carteira
    Then eu devo receber código de status "200"
    And a resposta deve conter o campo "balance"
    And a resposta deve conter o campo "tokens"
    And a resposta deve conter o campo "transactionHistory"
    And o saldo retornado deve ser "5.5"
    And a lista de tokens deve conter "3" items

  @regression @wallet
  Scenario: Consulta bem-sucedida de carteira vazia
    Given uma carteira com endereço "0x0000000000000000000000000000000000000000"
    And a carteira possui saldo zero
    When eu solicito os detalhes da carteira
    Then eu devo receber código de status "200"
    And o saldo retornado deve ser "0"
    And a lista de tokens deve estar vazia

  @negative @wallet @error-handling
  Scenario: Falha ao consultar carteira com endereço inválido
    Given uma carteira com endereço inválido "0xinvalid"
    When eu solicito os detalhes da carteira
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Invalid wallet address format"
    And nenhum dado deve ser retornado

  @negative @wallet @error-handling
  Scenario: Falha ao consultar carteira com endereço vazio
    Given uma carteira com endereço vazio ""
    When eu solicito os detalhes da carteira
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Wallet address is required"

  @security @wallet @authentication
  Scenario: Falha por Nation Pass inválido
    Given o agente não possui Nation Pass válido
    When eu solicito os detalhes de qualquer carteira
    Then eu devo receber código de status "401"
    And a resposta deve conter erro "Unauthorized - Nation Pass required"

  @security @wallet @authentication
  Scenario: Falha por Nation Pass expirado
    Given o agente possui Nation Pass expirado
    When eu solicito os detalhes de qualquer carteira
    Then eu devo receber código de status "401"
    And a resposta deve conter erro "Nation Pass expired"

  @performance @wallet
  Scenario: Resposta dentro do tempo limite esperado
    Given uma carteira com endereço "0x1234567890abcdef1234567890abcdef12345678"
    When eu solicito os detalhes da carteira
    Then a resposta deve ser entregue em menos de "2000" ms
    And eu devo receber código de status "200"

  @regression @wallet
  Scenario Outline: Consulta de múltiplas carteiras
    Given uma carteira com endereço "<address>"
    When eu solicito os detalhes da carteira
    Then eu devo receber código de status "200"
    And a resposta deve conter o campo "balance"

    Examples:
      | address                                    |
      | 0x1234567890abcdef1234567890abcdef12345678 |
      | 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd |
      | 0x0000000000000000000000000000000000000000 |
```

---

## 2. Token Price

**Localização**: `features/public-skills/token-price.feature`

```gherkin
Feature: Consulta de preço de token
  Como um usuário
  Eu quero consultar o preço atual de um token
  Para tomar decisões de investimento informadas

  Background:
    Given o sistema está conectado à rede
    And o serviço de preços está disponível

  @smoke @token-price
  Scenario: Consulta bem-sucedida de preço de token conhecido
    Given um token com símbolo "ETH"
    When eu solicito o preço do token
    Then eu devo receber código de status "200"
    And a resposta deve conter o campo "price"
    And a resposta deve conter o campo "currency"
    And o preço deve ser um número positivo

  @smoke @token-price
  Scenario: Consulta bem-sucedida de preço em múltiplas moedas
    Given um token com símbolo "BTC"
    When eu solicito o preço do token em "USD"
    Then eu devo receber código de status "200"
    And o preço em "USD" deve ser retornado
    And o preço deve ser maior que zero

  @negative @token-price @error-handling
  Scenario: Falha ao consultar token inexistente
    Given um token com símbolo inválido "XYZABC"
    When eu solicito o preço do token
    Then eu devo receber código de status "404"
    And a resposta deve conter erro "Token not found"

  @negative @token-price @error-handling
  Scenario: Falha por símbolo de token vazio
    Given um token com símbolo vazio ""
    When eu solicito o preço do token
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Token symbol is required"

  @performance @token-price
  Scenario: Resposta dentro do tempo limite
    Given um token com símbolo "ETH"
    When eu solicito o preço do token
    Then a resposta deve ser entregue em menos de "1000" ms

  @regression @token-price
  Scenario Outline: Consulta de preço para múltiplos tokens
    Given um token com símbolo "<symbol>"
    When eu solicito o preço do token
    Then eu devo receber código de status "200"
    And o preço deve ser um número positivo

    Examples:
      | symbol |
      | ETH    |
      | BTC    |
      | USDC   |
      | DAI    |
```

---

## 3. Token Search

**Localização**: `features/public-skills/token-search.feature`

```gherkin
Feature: Busca de tokens
  Como um usuário
  Eu quero buscar tokens por nome ou símbolo
  Para encontrar tokens específicos na rede

  Background:
    Given o sistema está conectado à rede
    And a base de dados de tokens está disponível

  @smoke @token-search
  Scenario: Busca bem-sucedida por nome de token
    Given um termo de busca "Ethereum"
    When eu executo a busca
    Then eu devo receber código de status "200"
    And a resposta deve conter a lista de resultados
    And o primeiro resultado deve conter "Ethereum"

  @smoke @token-search
  Scenario: Busca bem-sucedida por símbolo
    Given um termo de busca "ETH"
    When eu executo a busca
    Then eu devo receber código de status "200"
    And a resposta deve conter pelo menos "1" resultado
    And os resultados devem ser ordenados por relevância

  @regression @token-search
  Scenario: Busca retornando múltiplos resultados
    Given um termo de busca "Bitcoin"
    When eu executo a busca
    Then eu devo receber código de status "200"
    And a resposta deve conter entre "1" e "10" resultados
    And cada resultado deve ter campos "name", "symbol", "address"

  @negative @token-search @error-handling
  Scenario: Busca com termo vazio
    Given um termo de busca vazio ""
    When eu executo a busca
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Search term is required"

  @negative @token-search @error-handling
  Scenario: Busca com termo muito curto
    Given um termo de busca "A"
    When eu executo a busca
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Search term must be at least 2 characters"

  @negative @token-search @error-handling
  Scenario: Busca sem resultados
    Given um termo de busca "XYZNONEXISTENT123"
    When eu executo a busca
    Then eu devo receber código de status "200"
    And a lista de resultados deve estar vazia

  @performance @token-search
  Scenario: Busca completada dentro do tempo limite
    Given um termo de busca "Token"
    When eu executo a busca
    Then a resposta deve ser entregue em menos de "1500" ms
```

---

## 4. Token Analytics

**Localização**: `features/public-skills/token-analytics.feature`

```gherkin
Feature: Analytics de tokens
  Como um analista de blockchain
  Eu quero consultar métricas e dados analíticos de tokens
  Para compreender o comportamento e histórico dos tokens

  Background:
    Given o sistema está conectado à rede blockchain
    And o serviço de analytics está disponível

  @smoke @token-analytics
  Scenario: Consulta bem-sucedida de analytics de token
    Given um token com endereço "0x1234567890abcdef1234567890abcdef12345678"
    When eu solicito os dados de analytics
    Then eu devo receber código de status "200"
    And a resposta deve conter o campo "marketCap"
    And a resposta deve conter o campo "volume24h"
    And a resposta deve conter o campo "holders"
    And a resposta deve conter o campo "transactions"

  @regression @token-analytics
  Scenario: Analytics incluindo histórico de preço
    Given um token com endereço "0x1234567890abcdef1234567890abcdef12345678"
    When eu solicito os dados de analytics com período "30days"
    Then eu devo receber código de status "200"
    And a resposta deve conter o histórico de preço
    And o histórico deve conter "30" pontos de dados

  @regression @token-analytics
  Scenario: Analytics com dados de volume
    Given um token com endereço "0x1234567890abcdef1234567890abcdef12345678"
    When eu solicito os dados de analytics
    Then a resposta deve conter volume atual
    And o volume deve ser um número positivo
    And a resposta deve conter alteração percentual "24h"

  @negative @token-analytics @error-handling
  Scenario: Falha com endereço de token inválido
    Given um token com endereço inválido "0xinvalid"
    When eu solicito os dados de analytics
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Invalid token address"

  @negative @token-analytics @error-handling
  Scenario: Falha com token não encontrado
    Given um token com endereço "0x0000000000000000000000000000000000000000"
    When eu solicito os dados de analytics
    Then eu devo receber código de status "404"
    And a resposta deve conter erro "Token not found in database"

  @performance @token-analytics
  Scenario: Consulta de analytics dentro do tempo limite
    Given um token com endereço "0x1234567890abcdef1234567890abcdef12345678"
    When eu solicito os dados de analytics
    Then a resposta deve ser entregue em menos de "3000" ms

  @regression @token-analytics
  Scenario Outline: Analytics para múltiplos períodos
    Given um token com endereço "0x1234567890abcdef1234567890abcdef12345678"
    When eu solicito os dados de analytics com período "<period>"
    Then eu devo receber código de status "200"
    And a resposta deve conter dados para o período "<period>"

    Examples:
      | period  |
      | 24h     |
      | 7days   |
      | 30days  |
      | 90days  |
```

---

## 5. Token ERC20 Transfers

**Localização**: `features/public-skills/token-transfers.feature`

```gherkin
Feature: Transferências ERC20
  Como um analista de blockchain
  Eu quero listar e consultar transferências ERC20
  Para rastrear movimentações de tokens na rede

  Background:
    Given o sistema está conectado à rede blockchain
    And o serviço de transações está disponível

  @smoke @erc20-transfers
  Scenario: Consulta bem-sucedida de transferências de um token
    Given um token com endereço "0x1234567890abcdef1234567890abcdef12345678"
    When eu solicito a lista de transferências
    Then eu devo receber código de status "200"
    And a resposta deve conter a lista de transferências
    And cada transferência deve conter "from", "to", "amount", "timestamp"

  @regression @erc20-transfers
  Scenario: Transferências com filtro de endereço
    Given um token com endereço "0x1234567890abcdef1234567890abcdef12345678"
    And um filtro para endereço "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    When eu solicito a lista de transferências
    Then eu devo receber código de status "200"
    And todas as transferências devem envolver o endereço filtrado

  @regression @erc20-transfers
  Scenario: Transferências com limite de registros
    Given um token com endereço "0x1234567890abcdef1234567890abcdef12345678"
    And um limite de "10" registros
    When eu solicito a lista de transferências
    Then eu devo receber código de status "200"
    And a resposta deve conter no máximo "10" transferências
    And as transferências devem estar ordenadas por timestamp decrescente

  @negative @erc20-transfers @error-handling
  Scenario: Falha com endereço de token inválido
    Given um token com endereço inválido "0xinvalid"
    When eu solicito a lista de transferências
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Invalid token address format"

  @negative @erc20-transfers @error-handling
  Scenario: Falha com token não encontrado
    Given um token com endereço "0x0000000000000000000000000000000000000000"
    When eu solicito a lista de transferências
    Then eu devo receber código de status "404"
    And a resposta deve conter erro "Token not found"

  @performance @erc20-transfers
  Scenario: Consulta de transferências dentro do tempo limite
    Given um token com endereço "0x1234567890abcdef1234567890abcdef12345678"
    When eu solicito a lista de transferências
    Then a resposta deve ser entregue em menos de "2000" ms

  @regression @erc20-transfers
  Scenario: Transferências com paginação
    Given um token com endereço "0x1234567890abcdef1234567890abcdef12345678"
    And uma página "1" com "20" itens por página
    When eu solicito a lista de transferências
    Then eu devo receber código de status "200"
    And a resposta deve conter "20" transferências
    And a resposta deve conter informações de paginação
```

---

## 6. Tavily Search

**Localização**: `features/public-skills/tavily-search.feature`

```gherkin
Feature: Busca especializada com Tavily
  Como um usuário
  Eu quero realizar buscas especializadas na web
  Para encontrar informações relevantes sobre tópicos específicos

  Background:
    Given o serviço Tavily está disponível
    And a conexão com a internet está ativa

  @smoke @tavily-search
  Scenario: Busca bem-sucedida por termo
    Given um termo de busca "blockchain technology"
    When eu executo a busca Tavily
    Then eu devo receber código de status "200"
    And a resposta deve conter lista de resultados
    And cada resultado deve ter "title", "url", "snippet"

  @regression @tavily-search
  Scenario: Busca com múltiplos resultados
    Given um termo de busca "cryptocurrency market"
    And um limite de "10" resultados
    When eu executo a busca Tavily
    Then eu devo receber código de status "200"
    And a resposta deve conter entre "1" e "10" resultados
    And os resultados devem estar ordenados por relevância

  @regression @tavily-search
  Scenario: Busca com filtro de idioma
    Given um termo de busca "smart contracts"
    And um filtro de idioma "en"
    When eu executo a busca Tavily
    Then eu devo receber código de status "200"
    And todos os resultados devem estar em inglês

  @regression @tavily-search
  Scenario: Busca com filtro de data
    Given um termo de busca "DeFi protocols"
    And um filtro de data "last_week"
    When eu executo a busca Tavily
    Then eu devo receber código de status "200"
    And todos os resultados devem ser recentes
    And cada resultado deve ter um timestamp

  @negative @tavily-search @error-handling
  Scenario: Falha com termo de busca vazio
    Given um termo de busca vazio ""
    When eu executo a busca Tavily
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Search term is required"

  @negative @tavily-search @error-handling
  Scenario: Falha com termo muito curto
    Given um termo de busca "a"
    When eu executo a busca Tavily
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Search term must be at least 2 characters"

  @negative @tavily-search @error-handling
  Scenario: Falha sem resultados encontrados
    Given um termo de busca "xyznonexistentterm123xyz"
    When eu executo a busca Tavily
    Then eu devo receber código de status "200"
    And a lista de resultados deve estar vazia

  @performance @tavily-search
  Scenario: Busca completada dentro do tempo limite
    Given um termo de busca "web3"
    When eu executo a busca Tavily
    Then a resposta deve ser entregue em menos de "5000" ms
```

---

## 7. Walletactionprovider Native Transfer ⭐

**Localização**: `features/personal-skills/native-transfer.feature`

```gherkin
Feature: Transferência nativa de tokens
  Como um usuário com Nation Pass
  Eu quero transferir tokens nativamente
  Para enviar fundos para outras carteiras de forma segura

  Background:
    Given o agente possui Nation Pass válido
    And o sistema está conectado à rede blockchain
    And a carteira possui saldo suficiente

  @smoke @native-transfer @critical
  Scenario: Transferência bem-sucedida de tokens
    Given uma carteira origem com endereço "0xfrom1234567890abcdef1234567890abcdef"
    And uma carteira destino com endereço "0xto1234567890abcdef1234567890abcdef"
    And um valor de transferência "1.5" ETH
    When eu executo a transferência
    Then eu devo receber código de status "200"
    And a transação deve ser confirmada
    And o hash da transação deve ser retornado
    And o saldo da carteira origem deve diminuir "1.5"

  @regression @native-transfer
  Scenario: Transferência com taxa de rede
    Given uma carteira origem com saldo "10" ETH
    And uma carteira destino
    And um valor de transferência "5" ETH
    When eu executo a transferência
    Then a transação deve incluir taxa de rede
    And o saldo final deve refletir a dedução da taxa
    And o hash da transação deve ser gerado

  @negative @native-transfer @error-handling
  Scenario: Falha por saldo insuficiente
    Given uma carteira origem com saldo "0.5" ETH
    And uma carteira destino
    And um valor de transferência "2" ETH
    When eu executo a transferência
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Insufficient balance"
    And nenhuma transação deve ser criada

  @negative @native-transfer @error-handling
  Scenario: Falha por endereço destino inválido
    Given uma carteira origem com saldo suficiente
    And uma carteira destino com endereço inválido "0xinvalid"
    And um valor de transferência "1" ETH
    When eu executo a transferência
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Invalid destination address"

  @negative @native-transfer @error-handling
  Scenario: Falha por valor zero
    Given uma carteira origem com saldo suficiente
    And uma carteira destino válida
    And um valor de transferência "0" ETH
    When eu executo a transferência
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Transfer amount must be greater than zero"

  @security @native-transfer @authentication
  Scenario: Falha por Nation Pass inválido
    Given o agente não possui Nation Pass válido
    And uma carteira origem com saldo suficiente
    When eu executo a transferência
    Then eu devo receber código de status "401"
    And a resposta deve conter erro "Unauthorized - Nation Pass required"
    And nenhuma transação deve ser criada

  @security @native-transfer @authentication
  Scenario: Falha por Nation Pass expirado
    Given o agente possui Nation Pass expirado
    When eu executo a transferência
    Then eu devo receber código de status "401"
    And a resposta deve conter erro "Nation Pass expired"

  @performance @native-transfer
  Scenario: Transferência confirmada dentro do tempo limite
    Given uma carteira origem com saldo suficiente
    And uma carteira destino válida
    And um valor de transferência "1" ETH
    When eu executo a transferência
    Then a resposta deve ser entregue em menos de "3000" ms
    And a transação deve ser confirmada na blockchain

  @regression @native-transfer
  Scenario Outline: Transferências com múltiplos valores
    Given uma carteira origem com saldo suficiente
    And uma carteira destino válida
    And um valor de transferência "<amount>" ETH
    When eu executo a transferência
    Then eu devo receber código de status "200"
    And o hash da transação deve ser retornado

    Examples:
      | amount |
      | 0.1    |
      | 0.5    |
      | 1.0    |
      | 5.0    |
```

---

## 8. Http GET

**Localização**: `features/personal-skills/http-get.feature`

```gherkin
Feature: Requisição HTTP GET
  Como um desenvolvedor
  Eu quero realizar requisições HTTP GET
  Para consultar dados de APIs externas

  Background:
    Given o agente está operacional
    And a conexão com a internet está ativa

  @smoke @http-get
  Scenario: GET bem-sucedido para API válida
    Given uma URL "https://api.example.com/users"
    When eu executo uma requisição GET
    Then eu devo receber código de status "200"
    And a resposta deve conter dados JSON válidos
    And o header "Content-Type" deve conter "application/json"

  @regression @http-get
  Scenario: GET com headers customizados
    Given uma URL "https://api.example.com/data"
    And headers customizados com "Authorization" "Bearer token123"
    When eu executo uma requisição GET
    Then eu devo receber código de status "200"
    And a resposta deve conter os dados solicitados

  @regression @http-get
  Scenario: GET com parâmetros de query
    Given uma URL "https://api.example.com/search"
    And parâmetro "q" com valor "blockchain"
    And parâmetro "limit" com valor "10"
    When eu executo uma requisição GET
    Then eu devo receber código de status "200"
    And a resposta deve conter até "10" resultados

  @negative @http-get @error-handling
  Scenario: Falha com URL inválida
    Given uma URL inválida "not-a-valid-url"
    When eu executo uma requisição GET
    Then eu devo receber erro "Invalid URL format"

  @negative @http-get @error-handling
  Scenario: Falha com endpoint não encontrado
    Given uma URL "https://api.example.com/nonexistent"
    When eu executo uma requisição GET
    Then eu devo receber código de status "404"
    And a resposta deve conter erro "Not Found"

  @negative @http-get @error-handling
  Scenario: Falha por timeout de conexão
    Given uma URL "https://slow-api.example.com/data"
    And um timeout de "1000" ms
    When eu executo uma requisição GET
    Then eu devo receber erro "Request timeout"

  @performance @http-get
  Scenario: GET completado dentro do tempo limite
    Given uma URL "https://api.example.com/users"
    When eu executo uma requisição GET
    Then a resposta deve ser entregue em menos de "5000" ms

  @regression @http-get
  Scenario: GET com resposta vazia
    Given uma URL "https://api.example.com/empty"
    When eu executo uma requisição GET
    Then eu devo receber código de status "200"
    And a resposta deve estar vazia ou conter dados vazios
```

---

## 9. Http PUT

**Localização**: `features/personal-skills/http-put.feature`

```gherkin
Feature: Requisição HTTP PUT
  Como um desenvolvedor
  Eu quero realizar requisições HTTP PUT
  Para atualizar dados em APIs externas

  Background:
    Given o agente está operacional
    And a conexão com a internet está ativa

  @smoke @http-put
  Scenario: PUT bem-sucedido com dados válidos
    Given uma URL "https://api.example.com/users/123"
    And um body JSON com dados "{"name": "John", "age": 30}"
    When eu executo uma requisição PUT
    Then eu devo receber código de status "200"
    And a resposta deve confirmar a atualização
    And o header "Content-Type" deve conter "application/json"

  @regression @http-put
  Scenario: PUT com headers customizados
    Given uma URL "https://api.example.com/data/456"
    And headers customizados com "Authorization" "Bearer token123"
    And um body JSON com dados "{"status": "active"}"
    When eu executo uma requisição PUT
    Then eu devo receber código de status "200"

  @regression @http-put
  Scenario: PUT atualizando parcialmente recurso
    Given uma URL "https://api.example.com/products/789"
    And um body JSON com dados "{"price": "99.99"}"
    When eu executo uma requisição PUT
    Then eu devo receber código de status "200"
    And a resposta deve refletir a atualização

  @negative @http-put @error-handling
  Scenario: Falha com JSON inválido
    Given uma URL "https://api.example.com/users/123"
    And um body inválido "invalid json"
    When eu executo uma requisição PUT
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Invalid JSON format"

  @negative @http-put @error-handling
  Scenario: Falha com recurso não encontrado
    Given uma URL "https://api.example.com/users/99999"
    And um body JSON com dados "{"name": "John"}"
    When eu executo uma requisição PUT
    Then eu devo receber código de status "404"
    And a resposta deve conter erro "Resource not found"

  @negative @http-put @error-handling
  Scenario: Falha por falta de autenticação
    Given uma URL "https://api.example.com/users/123"
    And sem header de autenticação
    And um body JSON com dados "{"name": "John"}"
    When eu executo uma requisição PUT
    Then eu devo receber código de status "401"
    And a resposta deve conter erro "Unauthorized"

  @performance @http-put
  Scenario: PUT completado dentro do tempo limite
    Given uma URL "https://api.example.com/users/123"
    And um body JSON com dados "{"name": "John"}"
    When eu executo uma requisição PUT
    Then a resposta deve ser entregue em menos de "5000" ms

  @regression @http-put
  Scenario Outline: PUT com múltiplos tipos de dados
    Given uma URL "https://api.example.com/resource/<id>"
    And um body JSON com dados "<data>"
    When eu executo uma requisição PUT
    Then eu devo receber código de status "200"

    Examples:
      | id  | data                           |
      | 123 | {"name": "Test", "active": true} |
      | 456 | {"status": "inactive"}         |
      | 789 | {"count": 42}                  |
```

---

## 10. Http POST

**Localização**: `features/personal-skills/http-post.feature`

```gherkin
Feature: Requisição HTTP POST
  Como um desenvolvedor
  Eu quero realizar requisições HTTP POST
  Para criar novos recursos em APIs externas

  Background:
    Given o agente está operacional
    And a conexão com a internet está ativa

  @smoke @http-post
  Scenario: POST bem-sucedido criando novo recurso
    Given uma URL "https://api.example.com/users"
    And um body JSON com dados "{"name": "John", "email": "john@example.com"}"
    When eu executo uma requisição POST
    Then eu devo receber código de status "201"
    And a resposta deve conter o ID do novo recurso
    And o header "Content-Type" deve conter "application/json"

  @regression @http-post
  Scenario: POST com headers customizados
    Given uma URL "https://api.example.com/posts"
    And headers customizados com "Authorization" "Bearer token123"
    And um body JSON com dados "{"title": "New Post", "content": "Content here"}"
    When eu executo uma requisição POST
    Then eu devo receber código de status "201"

  @regression @http-post
  Scenario: POST criando múltiplos recursos
    Given uma URL "https://api.example.com/batch"
    And um body JSON com dados contendo lista de recursos
    When eu executo uma requisição POST
    Then eu devo receber código de status "201"
    And todos os recursos devem ser criados

  @negative @http-post @error-handling
  Scenario: Falha com JSON inválido
    Given uma URL "https://api.example.com/users"
    And um body inválido "invalid json"
    When eu executo uma requisição POST
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Invalid JSON format"

  @negative @http-post @error-handling
  Scenario: Falha com campos obrigatórios faltando
    Given uma URL "https://api.example.com/users"
    And um body JSON com dados "{"name": "John"}"
    When eu executo uma requisição POST
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Missing required field: email"

  @negative @http-post @error-handling
  Scenario: Falha por falta de autenticação
    Given uma URL "https://api.example.com/users"
    And sem header de autenticação
    And um body JSON válido
    When eu executo uma requisição POST
    Then eu devo receber código de status "401"
    And a resposta deve conter erro "Unauthorized"

  @negative @http-post @error-handling
  Scenario: Falha por conflito de recurso
    Given uma URL "https://api.example.com/users"
    And um body JSON com email que já existe "duplicate@example.com"
    When eu executo uma requisição POST
    Then eu devo receber código de status "409"
    And a resposta deve conter erro "Resource already exists"

  @performance @http-post
  Scenario: POST completado dentro do tempo limite
    Given uma URL "https://api.example.com/users"
    And um body JSON com dados válidos
    When eu executo uma requisição POST
    Then a resposta deve ser entregue em menos de "5000" ms

  @regression @http-post
  Scenario Outline: POST com múltiplos tipos de dados
    Given uma URL "https://api.example.com/<resource>"
    And um body JSON com dados "<data>"
    When eu executo uma requisição POST
    Then eu devo receber código de status "201"

    Examples:
      | resource | data                           |
      | users    | {"name": "Alice", "age": 25}  |
      | posts    | {"title": "Test", "content": "Text"} |
      | products | {"sku": "ABC123", "price": 29.99} |
```

---

## 11. Pyth Fetch Price

**Localização**: `features/personal-skills/pyth-price.feature`

```gherkin
Feature: Consulta de preço via Pyth Oracle
  Como um desenvolvedor
  Eu quero consultar preços de ativos via Pyth Oracle
  Para obter dados de preço confiáveis e em tempo real

  Background:
    Given o serviço Pyth Oracle está disponível
    And a conexão com a rede está ativa

  @smoke @pyth-price
  Scenario: Consulta bem-sucedida de preço via Pyth
    Given um identificador de ativo Pyth "Crypto.BTC/USD"
    When eu solicito o preço via Pyth
    Then eu devo receber código de status "200"
    And a resposta deve conter o campo "price"
    And a resposta deve conter o campo "confidence"
    And o preço deve ser um número positivo

  @regression @pyth-price
  Scenario: Consulta de preço com timestamp
    Given um identificador de ativo Pyth "Crypto.ETH/USD"
    When eu solicito o preço via Pyth
    Then eu devo receber código de status "200"
    And a resposta deve conter timestamp do preço
    And o timestamp deve ser recente

  @regression @pyth-price
  Scenario: Consulta de preço com intervalo de confiança
    Given um identificador de ativo Pyth "Crypto.SOL/USD"
    When eu solicito o preço via Pyth
    Then eu devo receber código de status "200"
    And a resposta deve conter "price" e "confidence"
    And a confiança deve ser um percentual válido

  @regression @pyth-price
  Scenario: Comparação de preços com múltiplos ativos
    Given identificadores de ativos Pyth "Crypto.BTC/USD" e "Crypto.ETH/USD"
    When eu solicito o preço para ambos os ativos
    Then ambos devem retornar código de status "200"
    And ambos os preços devem ser números positivos

  @negative @pyth-price @error-handling
  Scenario: Falha com identificador de ativo inválido
    Given um identificador de ativo inválido "INVALID/INVALID"
    When eu solicito o preço via Pyth
    Then eu devo receber código de status "400"
    And a resposta deve conter erro "Invalid price feed identifier"

  @negative @pyth-price @error-handling
  Scenario: Falha com ativo não suportado
    Given um identificador de ativo "Commodity.UNKNOWN/USD"
    When eu solicito o preço via Pyth
    Then eu devo receber código de status "404"
    And a resposta deve conter erro "Price feed not found"

  @negative @pyth-price @error-handling
  Scenario: Falha por serviço Pyth indisponível
    Given o serviço Pyth está temporariamente indisponível
    When eu solicito o preço via Pyth
    Then eu devo receber código de status "503"
    And a resposta deve conter erro "Service unavailable"

  @performance @pyth-price
  Scenario: Consulta de preço dentro do tempo limite
    Given um identificador de ativo Pyth "Crypto.BTC/USD"
    When eu solicito o preço via Pyth
    Then a resposta deve ser entregue em menos de "1000" ms

  @regression @pyth-price
  Scenario Outline: Consulta de preço para múltiplos ativos suportados
    Given um identificador de ativo Pyth "<asset>"
    When eu solicito o preço via Pyth
    Then eu devo receber código de status "200"
    And o preço deve ser um número positivo

    Examples:
      | asset              |
      | Crypto.BTC/USD     |
      | Crypto.ETH/USD     |
      | Crypto.SOL/USD     |
      | Crypto.XRP/USD     |
      | Crypto.ADA/USD     |
```

---

## Resumo de Testes BDD

| Skill | Arquivo Feature | Cenários | Tags Principais |
|-------|-----------------|----------|-----------------|
| 1. Wallet Details ⭐ | wallet-details.feature | 8 | @smoke, @security, @performance |
| 2. Token Price | token-price.feature | 6 | @smoke, @regression, @error-handling |
| 3. Token Search | token-search.feature | 7 | @smoke, @regression, @performance |
| 4. Token Analytics | token-analytics.feature | 7 | @smoke, @regression, @error-handling |
| 5. Token Transfers | token-transfers.feature | 7 | @smoke, @regression, @error-handling |
| 6. Tavily Search | tavily-search.feature | 8 | @smoke, @regression, @performance |
| 7. Native Transfer ⭐ | native-transfer.feature | 9 | @smoke, @security, @critical |
| 8. HTTP GET | http-get.feature | 8 | @smoke, @regression, @performance |
| 9. HTTP PUT | http-put.feature | 8 | @smoke, @regression, @error-handling |
| 10. HTTP POST | http-post.feature | 9 | @smoke, @regression, @error-handling |
| 11. Pyth Price | pyth-price.feature | 9 | @smoke, @regression, @performance |

**Total: 91 Cenários de Teste BDD**

---

## Tags Utilizadas

- **@smoke**: Testes críticos que devem rodar sempre
- **@regression**: Suite completa para validação
- **@error-handling**: Testes de cenários de erro
- **@security**: Testes com validações de segurança
- **@authentication**: Testes de autenticação
- **@performance**: Testes de performance
- **@critical**: Testes críticos para produção
- **⭐ Requer Nation Pass**: Skills que exigem autenticação especial