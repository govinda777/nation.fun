# 🚀 nation.fun

> Um projeto modelo para conectar agentes e criar novos de forma simples e elegante

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/govinda777/nation.fun?style=social)](https://github.com/govinda777/nation.fun)
[![GitHub forks](https://img.shields.io/github/forks/govinda777/nation.fun?style=social)](https://github.com/govinda777/nation.fun)

## 📋 Sobre o Projeto

**nation.fun** é uma plataforma inovadora e bem estruturada que funciona como um projeto modelo para conectar com agentes inteligentes e criar novos agentes de forma prática e eficiente. Este projeto foi desenvolvido com as melhores práticas de engenharia de software, incluindo testes unitários, BDD (Behavior-Driven Development), integração com Next.js e hospedagem via Vercel.

Ideal para desenvolvedores que desejam entender como trabalhar com sistemas de agentes, criar integrações escaláveis e manter um código limpo e bem documentado.

## ✨ Características Principais

- **Conexão com Agentes**: Conecte-se facilmente com agentes existentes
- **Criação de Novos Agentes**: Interface intuitiva para criar e gerenciar agentes
- **Estrutura Limpa**: Projeto bem organizado e fácil de estender
- **Testes Automatizados**: Cobertura com testes unitários e BDD
- **Deploy Automático**: Hospedagem via Vercel
- **Documentação Completa**: Código autoexplicativo com boas práticas

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| **Gherkin** | BDD e especificações de comportamento |
| **JavaScript** | Lógica e interatividade |
| **Next.js** | Framework React para aplicações web |
| **CSS** | Estilos e design responsivo |
| **HTML** | Marcação semântica |
| **Git** | Controle de versão |
| **Vercel** | Hospedagem |

## 🚀 Como Começar

### Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn como gerenciador de pacotes
- Git instalado na sua máquina

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/govinda777/nation.fun.git
   cd nation.fun
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Execute o projeto em desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Abra no navegador:**
   ```
   http://localhost:3000
   ```

## 📁 Estrutura do Projeto

```
nation.fun/
├── public/              # Arquivos estáticos
├── pages/              # Páginas e rotas de API
├── features/           # Especificações BDD (.feature)
├── next.config.js      # Configuração Next.js
├── package.json        # Dependências do projeto
└── README.md           # Este arquivo
```

## 🧪 Testes

Execute os testes para garantir que tudo está funcionando corretamente:

```bash
# Testes unitários
npm run test

# BDD com Gherkin
npm run test:bdd

# Cobertura de testes
npm run test:coverage
```

## 🚢 Publicando na Vercel

Para publicar sua aplicação na Vercel, siga os passos abaixo:

1.  **Crie uma conta na Vercel:**
    *   Acesse [vercel.com](https://vercel.com) e crie uma conta gratuitamente. Você pode se registrar usando sua conta do GitHub, GitLab ou Bitbucket.

2.  **Importe o projeto do GitHub:**
    *   No painel da Vercel, clique em "Add New..." e selecione "Project".
    *   Conecte sua conta do GitHub e selecione o repositório `nation.fun`.

3.  **Configure o projeto:**
    *   A Vercel detectará automaticamente que este é um projeto Next.js e aplicará as configurações padrão.
    *   **Importante:** Adicione a variável de ambiente `TOKEN_NATION` se a sua aplicação a utiliza para funcionalidades de chat. Vá para a seção "Environment Variables" e adicione a chave e o valor correspondente.

4.  **Faça o deploy:**
    *   Clique no botão "Deploy". A Vercel irá construir e publicar sua aplicação.
    *   Após o deploy, você receberá um link para acessar sua aplicação ao vivo.

Qualquer push para a branch `main` irá acionar um novo deploy automaticamente.

## 📖 Documentação

- [Como criar um novo agente](docs/CRIAR_AGENTE.md)
- [Guia de API](docs/API.md)
- [Exemplos de uso](docs/EXEMPLOS.md)

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir com o projeto:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -am 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

Para mais detalhes, veja o [CONTRIBUTING.md](CONTRIBUTING.md)

## 📋 Código de Conduta

Este projeto adota um Código de Conduta que todos os contribuidores devem seguir. Leia o [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) para mais informações.

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE) - veja o arquivo LICENSE para detalhes.

## 🎯 Roadmap

- [ ] Autenticação de usuários
- [ ] Dashboard avançado de agentes
- [ ] Integração com mais plataformas
- [ ] API REST completa
- [ ] Documentação em vídeo

## 📞 Suporte

Tem dúvidas ou problemas? 

- 📧 Abra uma [issue](https://github.com/govinda777/nation.fun/issues)
- 💬 Participate das discussões
- 📚 Consulte a [documentação](docs/)

## 👤 Autor

**Govinda** - [@govinda777](https://github.com/govinda777)

## 🙏 Agradecimentos

Agradeço a todos que contribuem, reportam bugs e sugerem melhorias para este projeto!

---

<div align="center">

Made with ❤️ by [govinda777](https://github.com/govinda777)

[⬆ voltar ao topo](#nation.fun)

</div>
