# Cypress Automation CI/CD EXAMPLE

## 📋 Descrição

Projeto de exemplo de implementação de **CI/CD** através de **GitHub Actions**, com foco em testes automatizados **E2E** (end-to-end) de front-end e back-end, em um sistema **CRUD de Estoque** com **sistema de permissões** integrado.
O sistema de estoque foi feito com Google Studio, tendo minha autoria somente nos testes automatizados.

### Arquitetura Moderna

```
┌─────────────┐      HTTP      ┌────────────┐      SQL      ┌──────────────┐
│   React     │◄───────────────►│   Go API   │◄─────────────►│ PostgreSQL   │
│  (Frontend) │                 │(  Backend  │               │  (Database)  │
└─────────────┘                 └────────────┘               └──────────────┘
 Porta 3000                      Porta 8080                     Porta 5432
```

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 19** com TypeScript
- **Vite** - Build tool rápido
- **Tailwind CSS** - Estilos
- **Validação de Inputs** - Preço e quantidade não-negativos

### Backend

- **Go 1.21** - Linguagem de programação
- **PostgreSQL 16** - Banco de dados
- **CORS** - Cross-origin requests

### DevOps

- **Docker** & **Docker Compose** - Containerização
- **GitHub Actions** - CI/CD Pipeline
- **Alpine Linux** - Imagens leves

## 📁 Estrutura do Projeto

```
cypress_automation_cicd_example/
├── front/                 # React + Vite (PORT 3000)
│   ├── src/
│   ├── components/
│   ├── views/
│   ├── services/
│   ├── package.json
│   └── Dockerfile
├── back/                  # Go Backend (PORT 8080)
│   ├── main.go
│   ├── go.mod
│   └── Dockerfile
├── db/                    # PostgreSQL Setup
│   └── init.sql          # Schema & dados iniciais
├── cypress/              # Testes E2E
│   └── Sistema exemplo/
├── docker-compose.yml    # Orquestração
├── .env                  # Variáveis de ambiente
├── DOCKER_SETUP.md       # Guia de uso
└── readme.md             # Este arquivo
```

## ⚡ Quick Start

### 1. Pré-requisitos

- Docker
- Docker Compose

### 2. Iniciar Sistema Completo

```bash
cd C:\Projetos\CypressAutomationCICDEXAMPLE
docker-compose up --build
```

### 3. Acessar Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/health
- **Database**: localhost:5432

## 🎯 Funcionalidades

### ✅ CRUD de Estoque

- Adicionar produtos
- Editar quantidade e preço
- Deletar produtos
- **Validação**: Preço e quantidade não podem ser negativos
- **Modal de confirmação** para delete

### 👥 Gerenciamento de Usuários

- Criar usuários
- Atribuir a grupos
- Classificar como Admin ou Usuário Padrão
- **Modal de confirmação** para delete

### 🔐 Sistema de Permissões RBAC

- Gerente de Estoque
- Gerente de Usuários
- Gerente de Grupos
- Controle granular de acesso

### 📊 Dados Iniciais

**Produtos:**

- Teclado Mecânico (KB-001) - R$ 150.00
- Mouse Gamer (MS-001) - R$ 80.00
- Monitor 27" (MON-001) - R$ 800.00

**Usuários:**

- admin (Super Admin)
- john (Usuário)
- jane (Usuário)

## 🐳 Docker Compose Services

| Serviço | Imagem             | Porta | Container Name   |
| ------- | ------------------ | ----- | ---------------- |
| Front   | node:22-alpine     | 3000  | stockguard-front |
| Back    | golang:1.21-alpine | 8080  | stockguard-back  |
| DB      | postgres:16-alpine | 5432  | stockguard-db    |

## 📚 Documentação

- [DOCKER_SETUP.md](DOCKER_SETUP.md) - Guia completo de Docker
- [Backend API Docs](#) - Endpoints disponíveis

## 🧪 Testes

Testes E2E com Cypress:

```bash
cd cypress
npm install
npm run test
```

## 🚀 Deployment

### Produção com GitHub Actions

Automatizado com:

- Build das imagens Docker
- Testes E2E
- Deploy na infraestrutura

## 📝 Variáveis de Ambiente

```env
# Frontend
VITE_API_URL=http://localhost:8080

# Backend
DB_HOST=db
DB_PORT=5432
DB_USER=stockguard_user
DB_PASSWORD=stockguard_pass
DB_NAME=stockguard_db
```

## ⚙️ Troubleshooting

**Porta 3000 já em uso?**

```bash
docker-compose down
docker-compose up --build
```

**Backend não conecta ao banco?**

```bash
docker-compose logs db
docker-compose logs back
```

**Limpar tudo e recomeçar?**

```bash
docker-compose down -v
docker-compose up --build
```

## 👨‍💻 Stack

- React 19 + TypeScript + Vite
- Go 1.21 + PostgreSQL 16
- Docker + GitHub Actions

---

**Próximos Passos:**

- [x] Integração com GitHub Actions
- [ ] Mais testes E2E
- [ ] API Documentation com Swagger
