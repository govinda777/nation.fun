# Como Funcionam as Taxas na Plataforma?

A transparência é fundamental na Nation.fun. Usamos a tecnologia de "carteiras inteligentes" (ERC-4337) não apenas para segurança, mas também para automatizar a cobrança de taxas de forma clara e eficiente.

## O Papel do Smart Contract

As taxas na nossa plataforma são gerenciadas por um **Smart Contract** — um programa autônomo e transparente que fica na blockchain da Base. Este contrato está conectado à sua carteira inteligente Privy e executa as regras de cobrança de forma automática.

**Como as taxas são definidas?**

O Smart Contract é programado para aplicar taxas de duas maneiras:

1.  **Valor Fixo:** Uma quantia específica por transação (ex: 0,50 USD por compra).
2.  **Porcentagem:** Uma porcentagem sobre o valor da transação (ex: 2% sobre a venda de uma NFT).

A regra aplicada (fixa ou porcentagem) é definida diretamente na lógica do Smart Contract, garantindo que as cobranças sejam previsíveis e consistentes para todos os usuários.

## Situações em que as Taxas se Aplicam

Graças ao padrão ERC-4337, as taxas podem ser cobradas de forma integrada em diversas operações, sem que o usuário final precise se preocupar em ter criptomoedas para pagar por elas. O sistema pode deduzir a taxa diretamente do valor da transação.

Exemplos de cobrança:

-   **Compra de Tokens (`NATO`):** Ao comprar tokens, uma pequena taxa pode ser adicionada para cobrir os custos da operação.
-   **Compra e Venda de NFTs (`Nation Pass`):** Uma taxa pode ser aplicada no momento da compra ou sobre o valor da venda de uma NFT.
-   **Uso do Agente:** Para certas interações avançadas ou transações mediadas pelo Agente (como fechar uma venda), o Smart Contract pode cobrar uma taxa de serviço. Isso se aplica tanto a transações dentro da sua carteira Privy quanto a interações com outras carteiras inteligentes.

O objetivo deste sistema é criar um ecossistema sustentável, onde os custos de operação da rede são cobertos de maneira transparente, permitindo que a plataforma continue a oferecer serviços de alta qualidade.
