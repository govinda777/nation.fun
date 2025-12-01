# Pipeline CI/CD - nation.fun

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura da Pipeline](#arquitetura-da-pipeline)
- [Workflows](#workflows)
  - [1. Test Workflow](#1-test-workflow)
  - [2. Deploy Workflow (Vercel)](#2-deploy-workflow-vercel)
  - [3. Documentation Workflow (GitHub Pages)](#3-documentation-workflow-github-pages)
- [Configuração de Secrets](#configuração-de-secrets)
- [Hooks Git](#hooks-git)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Troubleshooting](#troubleshooting)
- [Checklist de Validação](#checklist-de-validação)

---

## Visão Geral

A pipeline de CI/CD do projeto **nation.fun** garante qualidade de código, segurança e deploy automatizado através de três pilares principais:

| Componente | Tecnologia | Destino | Trigger |
|------------|-----------|---------|---------|
| **Aplicação Next.js** | Vercel | `https://nationfun.vercel.app` | Push em `main` |
| **Documentação** | MkDocs + GitHub Pages | `https://govinda777.github.io/nation.fun` | Workflow de CI concluído |
| **Testes & Qualidade** | Jest + ESLint + TypeScript | Codecov | Push/PR em `main` |

### Objetivos

✅ Garantir que todo código em `main` seja validado (lint, type-check, testes)  
✅ Deploy automático do site na Vercel após testes passarem  
✅ Publicação automática da documentação e relatórios de teste no GitHub Pages  
✅ Prevenir commits quebrados através de Git hooks locais

---

## Arquitetura da Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                         Developer                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ git push
                         ▼
                  ┌──────────────┐
                  │  Pre-push    │
                  │  Hook        │
                  │  (Husky)     │
                  └──────┬───────┘
                         │
                         │ Type-check + Tests Pass
                         ▼
                  ┌──────────────┐
                  │   GitHub     │
                  │   (main)     │
                  └──────┬───────┘
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
        ┌───────────────┐  ┌─────────────────┐
        │  Test         │  │  Deploy         │
        │  Workflow     │  │  Workflow       │
        │               │  │  (needs: test)  │
        └───────┬───────┘  └────────┬────────┘
                │                   │
                │ Success           │ Deploy
                ▼                   ▼
        ┌───────────────┐   ┌──────────────┐
        │  Codecov      │   │   Vercel     │
        │  Upload       │   │  Production  │
        └───────┬───────┘   └──────────────┘
                │
                │ Trigger
                ▼
        ┌───────────────────┐
        │  Deploy Docs      │
        │  Workflow         │
        └────────┬──────────┘
                 │
                 │ Publish
                 ▼
        ┌───────────────────┐
        │  GitHub Pages     │
        │  (Docs + Report)  │
        └───────────────────┘
```

---

## Workflows

### 1. Test Workflow

**Arquivo:** `.github/workflows/test.yml`

#### Responsabilidade
Executar suíte completa de qualidade de código: linting, verificação de tipos TypeScript e testes unitários com cobertura.

#### Triggers
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

#### Etapas de Execução

| Step | Comando | Descrição | Falha Bloqueia? |
|------|---------|-----------|-----------------|
| 1 | `actions/checkout@v4` | Checkout do código | ✅ Sim |
| 2 | `actions/setup-node@v4` | Setup Node.js 20 + cache npm | ✅ Sim |
| 3 | `npm ci` | Instalação de dependências | ✅ Sim |
| 4 | `npm run lint` | ESLint validation | ✅ Sim |
| 5 | `npm run type-check` | TypeScript compilation check | ✅ Sim |
| 6 | `npm run test:coverage` | Jest tests + coverage report | ✅ Sim |
| 7 | `codecov/codecov-action@v4` | Upload coverage to Codecov | ⚠️ Não |

#### Scripts npm Relacionados

```json
{
  "scripts": {
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

#### Configuração de Cobertura

**Arquivo:** `jest.config.cjs`

```javascript
collectCoverageFrom: [
  'app/**/*.{js,jsx,ts,tsx}',
  'components/**/*.{js,jsx,ts,tsx}',
  'lib/**/*.{js,jsx,ts,tsx}',
  'hooks/**/*.{js,jsx,ts,tsx}',
],
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

#### Secrets Necessários

| Secret | Descrição | Obrigatório |
|--------|-----------|-------------|
| `CODECOV_TOKEN` | Token de integração Codecov | ⚠️ Recomendado |

#### Resultados Esperados

✅ Código sem erros de lint  
✅ Tipagem TypeScript válida  
✅ Todos os testes passando  
✅ Cobertura ≥ 80% em branches, functions, lines e statements  
✅ Relatório de cobertura disponível no Codecov

---

### 2. Deploy Workflow (Vercel)

**Arquivo:** `.github/workflows/deploy.yml`

#### Responsabilidade
Deploy automatizado da aplicação Next.js na plataforma Vercel em ambiente de produção.

#### Triggers
```yaml
on:
  push:
    branches: [main]
```

#### Estrutura de Jobs

```yaml
jobs:
  test:
    uses: ./.github/workflows/test.yml
  
  deploy:
    needs: test  # ⚠️ Só executa se testes passarem
    runs-on: ubuntu-latest
```

#### Etapas de Execução

| Step | Action/Comando | Descrição |
|------|----------------|-----------|
| 1 | `actions/checkout@v4` | Checkout do código |
| 2 | `amondnet/vercel-action@v25` | Deploy para Vercel com `--prod` flag |

#### Secrets Necessários

| Secret | Como Obter | Exemplo |
|--------|------------|---------|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens | `AbCdEf123...` |
| `VERCEL_ORG_ID` | `.vercel/project.json` após primeiro deploy manual | `team_AbC123` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` após primeiro deploy manual | `prj_XyZ789` |

#### Configuração Vercel

**Arquivo:** `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NATION_TOKEN": "@nation-token-prod",
    "NEXT_PUBLIC_APP_URL": "https://nationfun.vercel.app"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ]
}
```

#### Variáveis de Ambiente

**Configuração na Vercel:**

1. Acessar: Vercel Dashboard → Project → Settings → Environment Variables
2. Adicionar variáveis sensíveis:
   - `NATION_TOKEN`: Token de API do backend Nation
   - `COINBASE_API_KEY`: Chave Coinbase CDP SDK (se aplicável)
   - `WHATSAPP_VERIFY_TOKEN`: Token de verificação webhook WhatsApp

#### Resultados Esperados

✅ Build Next.js concluído com sucesso  
✅ Deploy em produção na URL: `https://nationfun.vercel.app`  
✅ Headers de segurança aplicados em rotas `/api/*`  
✅ Variáveis de ambiente injetadas corretamente

---

### 3. Documentation Workflow (GitHub Pages)

**Arquivo:** `.github/workflows/deploy-docs.yml`

#### Responsabilidade
Publicar documentação técnica (MkDocs) e relatórios de teste no GitHub Pages.

#### Triggers
```yaml
on:
  workflow_run:
    workflows: ["Run Tests"]  # ⚠️ Nome deve coincidir com test.yml
    types: [completed]
    branches: [main]
  workflow_dispatch:  # Permite execução manual
```

#### Permissões Necessárias
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

#### Etapas de Execução

| Step | Ação | Descrição |
|------|------|-----------|
| 1 | Validação | Verifica se workflow de testes concluiu com sucesso |
| 2 | `actions/checkout@v4` | Checkout do repositório |
| 3 | `actions/download-artifact@v4` | Download do artefato `test-report` |
| 4 | `actions/setup-python@v4` | Setup Python para MkDocs |
| 5 | `pip install -r requirements.txt` | Instalação de dependências MkDocs |
| 6 | `mkdocs build` | Geração da documentação estática |
| 7 | Integração de Relatórios | Copia `reports-artifact` para `site/reports/` |
| 8 | `actions/upload-pages-artifact@v3` | Upload do site gerado |
| 9 | `actions/deploy-pages@v4` | Deploy no GitHub Pages |

#### Configuração MkDocs

**Arquivo:** `mkdocs.yml`

```yaml
site_name: nation.fun Docs
site_url: https://govinda777.github.io/nation.fun/
repo_url: https://github.com/govinda777/nation.fun
repo_name: govinda777/nation.fun

docs_dir: docs
site_dir: site

theme:
  name: material
  palette:
    primary: indigo
    accent: blue
  features:
    - navigation.tabs
    - navigation.sections
    - toc.integrate
    - search.suggest

nav:
  - Início: index.md
  - Arquitetura:
      - Visão Geral: architecture/overview.md
      - CI/CD Pipeline: architecture/ci-cd.md
      - Segurança: architecture/security.md
  - API:
      - Chat: api/chat.md
      - Agents: api/agents.md
      - WhatsApp: api/whatsapp.md
  - Relatórios:
      - Testes: reports/index.html
```

#### Dependências Python

**Arquivo:** `requirements.txt`

```txt
mkdocs==1.5.3
mkdocs-material==9.5.3
pymdown-extensions==10.7
```

#### Configuração GitHub Pages

**Configuração no Repositório:**

1. Acessar: `Settings → Pages`
2. **Source:** Deploy from a branch → **GitHub Actions**
3. Verificar que o ambiente `github-pages` foi criado automaticamente

#### Geração do Artefato test-report

**Adicionar ao `test.yml`:**

```yaml
- name: Generate test report
  if: always()
  run: npm run test:report

- name: Upload test report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-report
    path: ./coverage/
    retention-days: 30
```

**Script npm:**

```json
{
  "scripts": {
    "test:report": "jest --coverage --coverageReporters=html"
  }
}
```

#### Resultados Esperados

✅ Documentação acessível em: `https://govinda777.github.io/nation.fun/`  
✅ Relatório de cobertura de testes em: `https://govinda777.github.io/nation.fun/reports/`  
✅ Navegação organizada por seções (Arquitetura, API, Relatórios)  
✅ Tema Material com busca e navegação por tabs

---

## Configuração de Secrets

### GitHub Secrets

**Caminho:** `Repository → Settings → Secrets and variables → Actions`

| Secret Name | Descrição | Como Obter | Scope |
|-------------|-----------|------------|-------|
| `CODECOV_TOKEN` | Token Codecov | [codecov.io](https://codecov.io) → Repo Settings | Test Workflow |
| `VERCEL_TOKEN` | Token API Vercel | Vercel → Settings → Tokens → Create | Deploy Workflow |
| `VERCEL_ORG_ID` | ID da organização Vercel | Arquivo `.vercel/project.json` | Deploy Workflow |
| `VERCEL_PROJECT_ID` | ID do projeto Vercel | Arquivo `.vercel/project.json` | Deploy Workflow |

### Vercel Environment Variables

**Caminho:** `Vercel Dashboard → Project → Settings → Environment Variables`

| Variable Name | Type | Environment | Exemplo |
|---------------|------|-------------|---------|
| `NATION_TOKEN` | Secret | Production | `nation_prod_abc123...` |
| `NEXT_PUBLIC_APP_URL` | Plain Text | Production | `https://nationfun.vercel.app` |
| `COINBASE_API_KEY` | Secret | Production | `organizations/*/apiKeys/*` |
| `WHATSAPP_VERIFY_TOKEN` | Secret | Production | `whatsapp_verify_xyz789` |

---

## Hooks Git

### Pre-push Hook

**Arquivo:** `.husky/pre-push`

```bash
#!/usr/bin/env bash
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-push hook: type-check and tests..."

# TypeScript Type Check
echo "📝 Running type-check..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript type check failed. Please fix the errors before pushing."
  exit 1
fi

# Run Tests
echo "🧪 Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests must pass before pushing."
  exit 1
fi

echo "✅ Pre-push checks passed. Proceeding with push..."
```

### Instalação dos Hooks

**Executar após clone:**

```bash
npm install
npm run prepare  # Instala Husky hooks
```

### Benefícios

✅ Impede push de código com erros de tipo  
✅ Garante que testes locais passem antes de enviar ao GitHub  
✅ Reduz falhas na CI economizando tempo de build  
✅ Mantém histórico do `main` limpo

---

## Fluxo de Desenvolvimento

### 1. Desenvolvimento em Feature Branch

```bash
# Criar nova branch
git checkout -b feature/nova-funcionalidade

# Desenvolver e commitar
git add .
git commit -m "feat: implementa nova funcionalidade"

# Push para GitHub (hooks validam código)
git push origin feature/nova-funcionalidade
```

### 2. Pull Request para Main

```bash
# Criar PR no GitHub
# ✅ Workflow "Run Tests" executa automaticamente
# ✅ Review de código pelos mantenedores
# ✅ Merge somente se testes passarem
```

### 3. Deploy Automático

```bash
# Após merge em main:
# 1. Workflow "Run Tests" executa novamente
# 2. Workflow "Deploy to Vercel" aguarda sucesso dos testes
# 3. Deploy em produção na Vercel
# 4. Workflow "Deploy Docs" publica documentação atualizada
```

### Diagrama de Fluxo

```
Developer         GitHub           Test Workflow     Deploy Workflow    GitHub Pages
    |                |                    |                 |                |
    |-- push ------->|                    |                 |                |
    |                |-- trigger -------->|                 |                |
    |                |                    |-- execute ----->|                |
    |                |                    |<-- success -----|                |
    |                |                    |                 |                |
    |                |<----------- status |                 |                |
    |                |                    |                 |-- deploy ----->|
    |                |                    |                 |                |
    |                |-- trigger docs ----|----------------|--------------->|
    |                |                    |                 |                |
    |<------ notification (email/webhook)|                 |                |
```

---

## Troubleshooting

### ❌ Erro: "CODECOV_TOKEN not found"

**Causa:** Secret não configurado no repositório.

**Solução:**
```bash
1. Acessar: https://codecov.io
2. Login com GitHub
3. Adicionar repositório nation.fun
4. Copiar token gerado
5. GitHub → Settings → Secrets → New repository secret
6. Name: CODECOV_TOKEN
7. Value: <token copiado>
```

---

### ❌ Erro: "Vercel deployment failed"

**Causa:** Secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` ou `VERCEL_PROJECT_ID` incorretos.

**Solução:**
```bash
# 1. Deploy manual local primeiro
npm i -g vercel
vercel login
vercel --prod

# 2. Verificar arquivo gerado
cat .vercel/project.json
# {
#   "orgId": "team_abc123",
#   "projectId": "prj_xyz789"
# }

# 3. Atualizar secrets no GitHub
# VERCEL_ORG_ID = team_abc123
# VERCEL_PROJECT_ID = prj_xyz789

# 4. Token: Vercel Dashboard → Settings → Tokens → Create
```

---

### ❌ Erro: "GitHub Pages deployment failed"

**Causa:** Permissões insuficientes ou artefato `test-report` não encontrado.

**Solução:**

**1. Verificar Permissões:**
```yaml
# Em deploy-docs.yml
permissions:
  contents: read
  pages: write
  id-token: write
```

**2. Validar Geração de Artefato:**
```yaml
# Adicionar em test.yml
- name: Upload test report
  uses: actions/upload-artifact@v4
  with:
    name: test-report
    path: ./coverage/
```

**3. Configurar GitHub Pages:**
```bash
Settings → Pages → Source → GitHub Actions
```

---

### ❌ Erro: "Pre-push hook not running"

**Causa:** Husky não instalado ou hooks não configurados.

**Solução:**
```bash
# Reinstalar Husky
npm install husky --save-dev

# Configurar hooks
npm run prepare

# Verificar instalação
ls -la .husky/
# Deve conter: _/, pre-push

# Testar hook
git push origin feature/test
# Deve executar type-check e tests antes do push
```

---

### ❌ Erro: "Tests pass locally but fail in CI"

**Causa:** Diferenças de ambiente (Node version, dependências, variáveis de ambiente).

**Solução:**

**1. Verificar Versão do Node:**
```json
// package.json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  }
}
```

```yaml
# test.yml
- uses: actions/setup-node@v4
  with:
    node-version: '20'  # ⚠️ Deve coincidir com versão local
```

**2. Limpar Cache:**
```bash
# Localmente
rm -rf node_modules package-lock.json
npm install
npm test

# No GitHub Actions (adicionar step)
- name: Clear npm cache
  run: npm cache clean --force
```

**3. Variáveis de Ambiente:**
```yaml
# test.yml
- name: Run tests
  env:
    NODE_ENV: test
    NATION_TOKEN: ${{ secrets.NATION_TOKEN_TEST }}
  run: npm test
```

---

## Checklist de Validação

### ✅ Configuração Inicial

- [ ] Repositório clonado localmente
- [ ] Node.js 20+ instalado
- [ ] Dependências instaladas: `npm install`
- [ ] Husky configurado: `npm run prepare`
- [ ] Testes locais passando: `npm test`
- [ ] Build Next.js funcionando: `npm run build`

### ✅ GitHub Secrets Configurados

- [ ] `CODECOV_TOKEN` adicionado
- [ ] `VERCEL_TOKEN` adicionado
- [ ] `VERCEL_ORG_ID` adicionado
- [ ] `VERCEL_PROJECT_ID` adicionado

### ✅ Vercel Environment Variables

- [ ] `NATION_TOKEN` configurado (Production)
- [ ] `NEXT_PUBLIC_APP_URL` configurado
- [ ] Outras variáveis sensíveis adicionadas

### ✅ GitHub Pages Configurado

- [ ] Settings → Pages → Source → "GitHub Actions"
- [ ] Ambiente `github-pages` criado automaticamente
- [ ] Proteção de branch `gh-pages` desabilitada (se existir)

### ✅ Workflows Funcionando

- [ ] Workflow "Run Tests" passa em PRs
- [ ] Workflow "Deploy to Vercel" executa após merge
- [ ] Workflow "Deploy Docs" publica documentação
- [ ] Badges de status no README atualizados

### ✅ Hooks Git Ativos

- [ ] Pre-push hook bloqueia código quebrado
- [ ] Type-check executando antes de push
- [ ] Testes executando antes de push

### ✅ Validação de Deploy

- [ ] Site acessível em: `https://nationfun.vercel.app`
- [ ] API routes funcionando: `https://nationfun.vercel.app/api/health`
- [ ] Docs acessíveis em: `https://govinda777.github.io/nation.fun/`
- [ ] Relatório de testes em: `https://govinda777.github.io/nation.fun/reports/`

### ✅ Monitoramento e Métricas

- [ ] Codecov reportando cobertura corretamente
- [ ] Logs de deploy na Vercel sem erros
- [ ] GitHub Actions mostrando histórico de execuções
- [ ] Notificações de falha configuradas (opcional)

---

## Próximos Passos

### Melhorias Recomendadas

1. **Testes E2E com Playwright**
   - Adicionar workflow dedicado para testes end-to-end
   - Executar em staging antes de produção

2. **Deploy Preview em PRs**
   - Configurar Vercel para criar preview URLs automaticamente
   - Adicionar comentário no PR com link do preview

3. **Monitoramento de Performance**
   - Integrar Lighthouse CI
   - Definir budgets de performance (FCP, LCP, TTI)

4. **Segurança**
   - Adicionar workflow de scan de vulnerabilidades (Snyk/Dependabot)
   - Implementar análise de secrets (GitGuardian)

5. **Notificações**
   - Configurar Slack webhook para notificar deploys
   - Alertas para falhas em produção

---

## Referências

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MkDocs Material Theme](https://squidfunk.github.io/mkdocs-material/)
- [Codecov Documentation](https://docs.codecov.com/)
- [Husky Git Hooks](https://typicode.github.io/husky/)
