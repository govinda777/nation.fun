# Guia de Instalação e Primeiros Passos

Este guia irá ajudá-lo a configurar o ambiente de desenvolvimento e a executar o projeto **nation.fun** localmente.

## Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados:

*   Node.js (versão 16 ou superior)
*   npm ou yarn como gerenciador de pacotes
*   Git

## Instalação

Siga os passos abaixo para clonar o repositório e instalar as dependências necessárias.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/govinda777/nation.fun.git
    cd nation.fun
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Execute o projeto em modo de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

4.  **Abra no seu navegador:**
    Acesse [`http://localhost:3000`](http://localhost:3000) para ver a aplicação em execução.

## Estrutura do Projeto

A estrutura de pastas do projeto é organizada da seguinte forma:

```
nation.fun/
├── public/              # Arquivos estáticos
├── components/          # Componentes React reutilizáveis
├── pages/              # Páginas da aplicação
├── styles/             # Arquivos de estilo CSS
├── features/           # Especificações BDD (.feature)
├── tests/              # Testes unitários
├── next.config.js      # Configuração Next.js
├── package.json        # Dependências do projeto
└── README.md           # Documentação principal
```

## Como Executar os Testes

O projeto possui uma suíte de testes para garantir a qualidade e a estabilidade do código.

### Testes Unitários
Para rodar os testes unitários, execute o comando:
```bash
npm run test
```

### Testes BDD (Behavior-Driven Development)
Os testes de comportamento são escritos com Gherkin e podem ser executados com:
```bash
npm run test:bdd
```

### Cobertura de Testes
Para gerar um relatório de cobertura de testes, utilize:
```bash
npm run test:coverage
```

## Processo de Deploy

O deploy da aplicação é feito automaticamente para o GitHub Pages.

1.  **Crie uma build de produção:**
    ```bash
    npm run build
    ```

2.  **Execute o deploy:**
    ```bash
    npm run deploy
    ```

A aplicação será publicada e estará acessível em: [https://govinda777.github.io/nation.fun/](https://govinda777.github.io/nation.fun/)
