# Documentação dos Contratos Inteligentes do Projeto Nation.fun

Esta documentação fornece uma visão geral completa dos contratos inteligentes localizados neste diretório, com seções dedicadas tanto para empreendedores quanto para desenvolvedores.

---

## Para Empreendedores: Simplificando a Web3 com Recompensas

### O que este projeto faz?

Imagine que um novo cliente quer usar sua plataforma, mas desiste no meio do caminho porque precisa comprar criptomoedas (como Ether) apenas para pagar as taxas de transação. É uma barreira de entrada enorme.

Este projeto resolve exatamente esse problema. Ele implementa um sistema que **elimina a necessidade de os usuários pagarem taxas de gás** para realizar ações na sua plataforma. Além disso, ele vai um passo além: a cada transação que o usuário realiza, ele **recebe um cashback** em forma de `GovindasCoin` (GVC), o token de fidelidade do nosso ecossistema.

Em resumo, o sistema faz duas coisas:
1.  **Paga as taxas de transação para o seu usuário**, tornando a experiência mais fluida e acessível.
2.  **Recompensa o usuário com tokens**, criando um programa de fidelidade que incentiva o engajamento e a retenção.

### Qual o benefício para o negócio?

*   **Aumento da Aquisição de Usuários:** Ao remover a complexidade e o custo das taxas de gás, você torna sua plataforma acessível a um público muito maior, especialmente aqueles que são novos no mundo da Web3.
*   **Maior Engajamento e Retenção:** O sistema de cashback funciona como um programa de fidelidade. Os usuários são incentivados a continuar usando a plataforma para acumular mais tokens GVC, que podem ser usados para obter benefícios futuros.
*   **Vantagem Competitiva:** Oferecer transações "sem gás" e com recompensas é um diferencial poderoso no mercado, melhorando significativamente a experiência do usuário.

---

## Para Desenvolvedores: Visão Técnica

### Visão Geral da Arquitetura

Este projeto implementa um **Paymaster de Cashback** seguindo o padrão **ERC-4337 (Account Abstraction)**. A arquitetura é composta por três contratos principais:

1.  **`GovindasCoin.sol`**
    *   **O quê:** Um contrato de token padrão `ERC20`.
    *   **Propósito:** Serve como o token de utilidade e recompensa do ecossistema. É o token que os usuários recebem como cashback.
    *   **Detalhes:** No momento do deploy, 1.000.000 de GVC são criados e enviados para a carteira do deployer.

2.  **`CashbackPaymaster.sol`**
    *   **O quê:** O núcleo da lógica de patrocínio de transações. Este contrato herda de `BasePaymaster` da implementação de referência do ERC-4337.
    *   **Propósito:** Sua função é interceptar uma `UserOperation` enviada a um `EntryPoint`, pagar as taxas de gás em nome do usuário e, em seguida, executar uma lógica pós-transação.
    *   **Fluxo de Execução:**
        1.  A função `_validatePaymasterUserOp` é chamada pelo `EntryPoint` para verificar se o Paymaster concorda em patrocinar a transação. Neste caso, ela sempre aprova.
        2.  Após a execução da transação, o `EntryPoint` chama a função `_postOp`.
        3.  Dentro da `_postOp`, o Paymaster decodifica o endereço do usuário que originou a operação e transfere `1 GVC` como cashback.
    *   **Funções Adicionais:**
        *   `depositGVC()`: Permite que qualquer pessoa deposite GVC no contrato para financiar o programa de cashback.
        *   `withdrawEth()`: Uma função de segurança para que o proprietário do contrato possa sacar ETH que tenha sido enviado diretamente ao Paymaster.

3.  **`MockERC721.sol`**
    *   **O quê:** Um contrato `ERC721` (NFT) básico.
    *   **Propósito:** Serve como um contrato de exemplo para fins de teste. Ele permite simular um cenário onde um usuário interage com um contrato de NFT, e o `Paymaster` patrocina essa interação (por exemplo, um `mint`). Apenas o proprietário pode criar novos NFTs.

### Como o Fluxo Funciona

1.  Um usuário (através de uma Smart Wallet) cria uma `UserOperation` (por exemplo, para mintar um NFT do `MockERC721`).
2.  A `UserOperation` é enviada para o `EntryPoint` global do ERC-4337, especificando o endereço do nosso `CashbackPaymaster`.
3.  O `EntryPoint` invoca `_validatePaymasterUserOp` no `CashbackPaymaster`. O Paymaster aprova o patrocínio.
4.  O `EntryPoint` executa a `UserOperation` (a chamada para o `MockERC721`).
5.  Após a execução, o `EntryPoint` chama `_postOp` no `CashbackPaymaster`.
6.  O `CashbackPaymaster` executa sua lógica de cashback, transferindo 1 GVC para o endereço do usuário.

Para que o sistema funcione, o `CashbackPaymaster` precisa ter fundos:
*   **ETH** depositado no `EntryPoint` para pagar as taxas de gás.
*   **GVC** no seu próprio endereço para distribuir como cashback.
