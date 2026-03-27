# sys-rh-backend-tests

Suite de testes de integração para a RH API.

## Pré-requisitos

- Node.js v20+
- Docker
- API (`sys-rh-backend`) rodando na porta 3000

## Configuração

### 1. Instalar dependências
npm install

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz:
API_URL=http://localhost:3000

### 3. Subir o banco de testes
docker-compose up -d

### 4. Rodar as migrations no banco de testes
Vá até o projeto da API e rode:
DATABASE_URL="postgresql://usuario:senha@localhost:5435/sys-rh-backend-test-db" npx prisma migrate deploy

## Rodando os testes

### Todos os testes
npm test

### Modo watch
npm run test:watch

### Um arquivo específico
npx jest src/tests/auth.test.ts