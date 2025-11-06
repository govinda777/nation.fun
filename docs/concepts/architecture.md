# Arquitetura do Sistema

Esta seção descreve a arquitetura geral da plataforma **nation.fun**.

## Componentes Principais

-   **Frontend:** Uma aplicação Next.js que fornece a interface do usuário, hospedada na Vercel.
-   **Backend (BFF):** Um conjunto de API routes no Next.js que orquestra as chamadas para os serviços principais.
-   **Serviço de Agentes:** O núcleo do sistema, responsável por executar a lógica dos agentes.
-   **Integrações:** Conectores que permitem que os agentes interajam com serviços externos como WhatsApp, Telegram, etc.

## Fluxo de Dados

1.  O usuário interage com o frontend.
2.  O frontend envia requisições para o backend (BFF).
3.  O BFF processa a lógica de negócio e se comunica com o Serviço de Agentes.
4.  O Serviço de Agentes executa as tarefas, utilizando as integrações quando necessário.
