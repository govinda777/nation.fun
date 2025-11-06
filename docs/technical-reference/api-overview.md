# Visão Geral da API

A API do **nation.fun** permite que desenvolvedores integrem seus próprios sistemas e aplicações com a nossa plataforma de agentes.

## Autenticação

Todas as requisições à API devem ser autenticadas utilizando uma chave de API. Você pode gerar e gerenciar suas chaves de API no painel de configurações.

## Endpoints Principais

-   `GET /agents`: Lista todos os seus agentes.
-   `GET /agents/{id}`: Obtém os detalhes de um agente específico.
-   `POST /agents`: Cria um novo agente.
-   `POST /agents/{id}/message`: Envia uma mensagem através de um agente.

Consulte a documentação completa de cada endpoint para mais detalhes sobre os parâmetros e respostas.
