# Nation Agent – Chat com IA + WhatsApp (Nuxt 4 + Vue 3)

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4-brightgreen)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3-success)](https://vuejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Chat em tempo real com IA (intentkit-001)** via API da Crestal Network, com botão de teste para webhook do WhatsApp.  
> Totalmente migrado do JavaScript vanilla para **Nuxt 4 + Vue 3 + TypeScript + Composables**.

---

## Demo (em desenvolvimento)

![Preview do Chat](./public/preview.png)  
*(Adicione uma screenshot real do chat aqui depois)*

---

## Funcionalidades

- Chat interativo com IA
- Envio com Enter ou botão
- Botão de teste para simular entrada do WhatsApp
- Token protegido no servidor (nunca exposto no frontend)
- Auto-scroll nas mensagens
- Tratamento de erros robusto
- Estrutura modular e escalável

---

## Tecnologias

| Camada | Tecnologia |
|-------|------------|
| Framework | [Nuxt 4](https://nuxt.com) |
| UI | Vue 3 + Composition API |
| Estado | `ref()` + `composables` |
| API | Nitro Server Routes (`server/api/`) |
| Fetch | `$fetch` (seguro client & server) |
| Estilos | CSS puro (scoped) |

---

## Estrutura do Projeto

```bash
nation-agent-nuxt/
├── app.vue                    # Layout global
├── pages/
│   └── index.vue              # Página principal
├── components/
│   └── ChatBox.vue            # Componente do chat
├── composables/
│   └── useChat.ts             # Lógica de envio e mensagens
├── server/
│   ├── api/
│   │   ├── chat.ts            # Proxy seguro para IA
│   │   └── whatsapp.post.ts   # Simula webhook do WhatsApp
├── public/
│   └── preview.png            # (opcional) screenshot
├── .env                       # Token (NUNCA commit!)
├── nuxt.config.ts
├── package.json
└── README.md
```

---

## Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nation-agent-nuxt.git
cd nation-agent-nuxt
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Crie o arquivo `.env`

```env
NATION_TOKEN=sk-seu-token-aqui
```

> **Nunca commit o `.env`!** Ele já está no `.gitignore`.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Endpoints da API

| Método | Rota | Descrição |
|-------|------|-----------|
| `POST` | `/api/chat` | Envia mensagem para IA (token protegido) |
| `POST` | `/api/whatsapp` | Simula entrada do WhatsApp |

---

## Segurança

- Token da IA **nunca vai para o cliente**
- Proxy em `server/api/chat.ts`
- Validação de entrada e saída
- Tratamento de erros com `createError`

---

## Deploy (Vercel, Netlify, Cloudflare)

```bash
npm run build
```

- **Vercel**: `vercel`
- **Netlify**: `netlify deploy`
- **Nitro**: Suporte nativo a serverless

> **Lembre-se de configurar a variável `NATION_TOKEN` no painel do deploy.**

---

## Próximos Passos (Roadmap)

| Feature | Status |
|-------|--------|
| Histórico com `localStorage` | Pendente |
| Suporte a Markdown | Pendente |
| Loading spinner | Pendente |
| Dark mode | Pendente |
| Integração real com WhatsApp (Meta API) | Pendente |

---

## Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-func`
3. Commit: `git commit -m "Adiciona X"`
4. Push: `git push origin feature/nova-func`
5. Abra um Pull Request

---

## Licença

[MIT License](LICENSE) – sinta-se livre para usar, modificar e distribuir.

---

## Autor

**Marcelo Magalhães**  
[GitHub](https://github.com/marceloamagalhaes) | [LinkedIn](https://linkedin.com/in/marceloamagalhaes)

---

> **"Do vanilla ao Vue em um passo."** – Nation Agent

---

Feito com ❤️ e Nuxt 4.  
**Star no GitHub se ajudou!** 🌟