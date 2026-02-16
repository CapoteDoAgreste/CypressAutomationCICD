# Docker Compose - StockGuard CRUD System

Configuração completa do ambiente Docker para o sistema de gestão de estoque com três componentes integrados.

## Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│              http://localhost:3000                   │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────┐
│                  Backend (Go/REST)                   │
│              http://localhost:8080                   │
└────────────────────┬────────────────────────────────┘
                     │
                     │ SQL Queries
                     ▼
┌─────────────────────────────────────────────────────┐
│            Database (PostgreSQL 16)                  │
│         Port: 5432 (interno)                         │
└─────────────────────────────────────────────────────┘
```

## Pré-requisitos

- Docker
- Docker Compose

## Estrutura do Projeto

```
.
├── front/              # React + Vite + TypeScript
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── back/               # Go Backend
│   ├── main.go
│   ├── go.mod
│   └── Dockerfile
├── db/                 # PostgreSQL
│   └── init.sql        # Schema e dados iniciais
├── docker-compose.yml  # Orquestração dos serviços
└── .env                # Variáveis de ambiente
```

## Como Usar

### 1. Preparar Ambiente

```bash
cd C:\Projetos\CypressAutomationCICDEXAMPLE
```

### 2. Iniciar Sistema Completo

Para iniciar todos os serviços:

```bash
docker-compose up --build
```

Ou em modo background (detached):

```bash
docker-compose up -d --build
```

Logs em tempo real:

```bash
docker-compose logs -f
```

### 3. Acessar Serviços

- **Frontend (React)**: http://localhost:3000
- **Backend (Go API)**: http://localhost:8080
- **Database**: localhost:5432
  - Usuário: `stockguard_user`
  - Senha: `stockguard_pass`
  - Database: `stockguard_db`

### 4. Verificar Saúde do Sistema

```bash
# Health check do backend
curl http://localhost:8080/api/health

# Conectar ao banco com psql
docker exec -it stockguard-db psql -U stockguard_user -d stockguard_db
```

### 5. Parar Serviços

```bash
docker-compose down
```

Remover volumes (dados do banco):

```bash
docker-compose down -v
```

## Serviços

### Frontend (stockguard-front)

- **Base Image**: node:22-alpine
- **Porta**: 3000
- **Tecnologia**: React + Vite + TypeScript
- **Features**:
  - Hot reload automático
  - Volume compartilhado para desenvolvimento
  - CRUD de Produtos
  - Gerenciamento de Usuários e Permissões

### Backend (stockguard-back)

- **Base Image**: golang:1.21-alpine
- **Porta**: 8080
- **Endpoints**:
  - `GET /api/health` - Ver status
  - `GET /api/products` - Listar produtos
  - `DELETE /api/products/{id}` - Deletar produto
  - `GET /api/users` - Listar usuários
  - `GET /api/groups` - Listar grupos

### Database (stockguard-db)

- **Base Image**: postgres:16-alpine
- **Porta**: 5432
- **Features**:
  - Inicialização automática com schema
  - Dados de exemplo pré-inseridos
  - Health check integrado
  - Persistência de dados com volume

## Dados Iniciais

O banco inicia com dados de exemplo:

**Produtos:**

- Teclado Mecânico (SKU: KB-001) - R$ 150.00
- Mouse Gamer (SKU: MS-001) - R$ 80.00
- Monitor 27" (SKU: MON-001) - R$ 800.00

**Usuários:**

- admin (Super Admin)
- john (Usuário Padrão)
- jane (Usuário Padrão)

**Grupos:**

- Gerentes
- Vendedores

## Troubleshooting

### Portas já em uso

Se alguma porta estiver ocupada, altere em `docker-compose.yml`:

```yaml
ports:
  - "3001:3000" # Frontend em 3001
  - "8081:8080" # Backend em 8081
  - "5433:5432" # DB em 5433
```

### Backend não consegue conectar ao banco

Certifique-se que:

1. O serviço `db` iniciou completamente
2. O health check passou (wait com `condition: service_healthy`)
3. Variáveis de ambiente estão corretas

```bash
docker-compose logs db
docker-compose logs back
```

### Limpar e Reconstruir

```bash
# Remover containers, networks e volumes
docker-compose down -v

# Reconstruir imagens
docker-compose build --no-cache

# Iniciar novamente
docker-compose up
```

### Acessar banco de dados

```bash
# Entrar no container do banco
docker exec -it stockguard-db bash

# Conectar ao psql
psql -U stockguard_user -d stockguard_db

# Listar tabelas
\dt

# Ver conteúdo de uma tabela
SELECT * FROM products;
```

### Ver logs de um serviço específico

```bash
docker-compose logs -f front
docker-compose logs -f back
docker-compose logs -f db
```

## Desenvolvimento

### Adicionar Endpoints no Backend

Edite `back/main.go` e redirecione requests:

```go
mux.HandleFunc("/api/seu-endpoint", seuHandler)
```

### Modificar Schema do Banco

Edite `db/init.sql` e reconstrua:

```bash
docker-compose down -v
docker-compose up --build
```

### Instalar Dependências do Frontend

```bash
docker exec stockguard-front npm install package-name
```

## Performance

- **Alpine Linux**: Imagens menores e mais leves
- **Multi-stage build**: Backend Go compilado em estágio separado
- **Volumes de desenvolvimento**: Hot reload para frontend
- **Health checks**: Garante que serviços estejam prontos

## Segurança

⚠️ **Nota para Produção:**

- Mudar credenciais padrão do banco
- Usar variáveis de ambiente secretas
- Configurar HTTPS/TLS
- Adicionar autenticação nos endpoints
- Usar secrets do Docker/Kubernetes
