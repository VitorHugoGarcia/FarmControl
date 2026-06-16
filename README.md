# FarmControl

Sistema de controle de estoque para farmácias, desenvolvido como projeto acadêmico do curso de Engenharia de Software da UFMS.

## 📋 Sobre o Projeto

O FarmControl permite gerenciar o estoque de medicamentos de uma farmácia, com controle de usuários por cargo, cadastro de medicamentos via formulário ou importação de nota fiscal XML, registro de vendas e geração de relatórios. O sistema aplica a política **FEFO** (First Expired, First Out) — medicamentos com validade mais próxima são priorizados nas vendas.

## 🚀 Tecnologias

### Frontend
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) — biblioteca de interface
- [Vite](https://vitejs.dev/) —servidor de desenvolvimento
- [Tailwind CSS](https://tailwindcss.com/) — estilização
- [React Router DOM](https://reactrouter.com/) — navegação entre páginas
- [Axios](https://axios-http.com/) — requisições HTTP para a API

### Backend
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) — servidor HTTP e gerenciamento de rotas
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática no backend
- [Prisma ORM](https://www.prisma.io/) — mapeamento objeto-relacional e acesso ao banco
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — hash de senhas
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — autenticação via JWT
- [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) — importação de nota fiscal XML
- [Multer](https://github.com/expressjs/multer) — upload de arquivos (Exportar XML)

### Banco de Dados
- [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional principal

## 🔐 Controle de Acesso

O sistema utiliza JWT para autenticação. Cada cargo tem acesso restrito a determinadas telas:

| Funcionalidade         | Balconista | Farmacêutico | Administrador |
|------------------------|:----------:|:------------:|:-------------:|
| Estoque (home)         | ✅         | ✅           | ✅            |
| Realizar Venda         | ✅         | ✅           | ✅            |
| Cadastrar Medicamento  | ❌         | ✅           | ✅            |
| Relatórios             | ❌         | ❌           | ✅            |
| Gestão de Usuários     | ❌         | ❌           | ✅            |

## 📁 Estrutura do Projeto

```text
FarmControl/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Layout.tsx
│       │   ├── Navbar.tsx
│       │   └── RotaProtegida.tsx
│       ├── pages/
│       │   ├── loginPages.tsx
│       │   ├── homePage.tsx
│       │   ├── cadastroManualPage.tsx
│       │   ├── cadastroUsuarioPage.tsx
│       │   ├── listarUsuariosPage.tsx
│       │   ├── editarUsuarioPage.tsx
│       │   ├── VendaPage.tsx
│       │   └── RelatoriosPage.tsx
│       ├── services/
│       │   ├── loginService.ts
│       │   ├── medicamento.service.ts
│       │   └── usuarioService.ts
│       └── utils/
│           └── auth.ts
├── backend/
│   └── src/
│       ├── controllers/
│       │   ├── medicamento-CRUD.controller.ts
│       │   ├── medicamento-Compra.controller.ts
│       │   ├── relatorios.controller.ts
│       │   └── usuarioController.ts
│       ├── routes/
│       │   ├── medicamento.routes.ts
│       │   └── usuarioRoutes.ts
│       ├── middlewares/
│       │   ├── authMiddleware.ts
│       │   └── cargoMiddleware.ts
│       ├── utils/
│       │   └── jwt.ts
│       └── prisma/
│           └── schema/
└── README.md
```

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- PostgreSQL rodando (local ou via Docker)

### 1. Clone o repositório
```bash
git clone https://github.com/VitorHugoGarcia/FarmControl.git
cd FarmControl
```

### 2. Configure as variáveis de ambiente

**Backend** — crie `backend/.env`:
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/farmcontrol
PORT=3333
JWT_SECRET=sua_chave_secreta
```

**Frontend** — crie `frontend/.env`:
```env
VITE_API_URL=http://localhost:3333
```

### 3. Instale as dependências e rode o backend
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### 4. Instale as dependências e rode o frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Acesso inicial

Use as credenciais de administrador temporário para o primeiro login:
- **E-mail:** `admin`
- **Senha:** `admin123`

Após entrar, cadastre os usuários definitivos pela tela de gestão de usuários.

## 🗂️ Principais Rotas da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/login` | Realiza login e retorna JWT |

### Usuários (requer token + cargo ADMINISTRADOR)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/usuario` | Cadastra novo usuário |
| GET | `/usuario` | Lista usuários ativos |
| GET | `/usuario/:CPF` | Busca usuário por CPF |
| PUT | `/usuario/:CPF` | Atualiza dados do usuário |
| PATCH | `/usuario/:CPF/desativar` | Desativa usuário |
| PATCH | `/usuario/:CPF/ativar` | Reativa usuário |
| PATCH | `/usuario/:CPF/senha` | Altera senha |

### Medicamentos (requer token)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/medicamentos` | Lista medicamentos (ordem FEFO) |
| POST | `/medicamentos` | Cadastra medicamento manualmente |
| POST | `/medicamentos/nota-fiscal` | Importa medicamentos via XML |
| GET | `/medicamentos/:id` | Busca medicamento por ID |
| GET | `/medicamentos/barcode/:codigo` | Busca por código de barras (FEFO) |
| PUT | `/medicamentos/:id` | Atualiza medicamento |
| DELETE | `/medicamentos/:id` | Remove medicamento |
| POST | `/medicamentos/compra` | Registra venda |

## 👥 Equipe

Projeto desenvolvido em grupo para fins acadêmicos — Engenharia de Software, UFMS.

Alunos: Luís Otávio Nantes, Vitor Hugo Batista, Pedro Henrique Mendonça, Caio Magno Borges
