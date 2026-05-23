# FarmControl

Sistema de controle de estoque para farmácias, desenvolvido como projeto acadêmico do curso de Engenharia de Software.

## 📋 Sobre o Projeto

O FarmControl permite gerenciar a entrada e saída de medicamentos de uma farmácia fictícia, oferecendo uma interface desktop para visualização do estoque e registro de compras.

## 🚀 Tecnologias

### Frontend
- [ElectronJS](https://www.electronjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Banco de Dados
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)

### Infraestrutura
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 📁 Estrutura do Projeto

```text
FarmControl/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── models/
│       └── prisma/
├── .env
├── .gitignore
├── docker-compose.yml
└── README.md
```

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js
- Docker e Docker Compose

### 1. Clone o repositório
```bash
git clone https://github.com/VitorHugoGarcia/FarmControl.git
cd FarmControl
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

### 3. Suba o banco de dados
```bash
docker compose up -d
```

### 4. Instale as dependências e rode o backend
```bash
cd backend
npm install
npm run dev
```

### 5. Instale as dependências e rode o frontend
```bash
cd frontend
npm install
npm run dev
```

## 👥 Equipe

Projeto desenvolvido em grupo para fins acadêmicos.