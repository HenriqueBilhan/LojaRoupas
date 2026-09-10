# JW Store

Loja virtual de streetwear (front-end + back-end) — catálogo de produtos,
carrinho, checkout, contas de cliente e painel administrativo.

## Estrutura do projeto

```
.
├── backend/          API (Node.js + Express + TypeORM + MySQL)
│   ├── src/
│   │   ├── entities/     modelos do banco (User, Product, Category, Order...)
│   │   ├── routes/       rotas da API
│   │   ├── middleware/    autenticação/autorização
│   │   ├── utils/         helpers (slugify, jwt)
│   │   └── seed.ts        popula o banco com dados de exemplo
│   └── database/     setup do MySQL (Docker ou local) — ver backend/database/README.md
└── frontend/         SPA (React + Vite + TypeScript + Tailwind)
    └── src/
        ├── api/          cliente HTTP (axios) e tipos
        ├── components/   componentes reutilizáveis (Navbar, Footer, cards...)
        ├── context/       estado global (auth, carrinho)
        └── pages/         páginas, com pages/admin/ para o painel admin
```

## Como rodar

### 1. Banco de dados

Veja [backend/database/README.md](backend/database/README.md) para subir o MySQL
via Docker ou usando uma instalação local.

### 2. Backend

```bash
cd backend
cp .env.example .env   # ajuste as credenciais do MySQL se necessário
npm install
npm run seed            # opcional: cria categorias, produtos de exemplo e o admin
npm run dev              # http://localhost:3333
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Login do admin (após rodar o seed)

- E-mail: o valor de `ADMIN_EMAIL` no `.env` do backend (padrão `admin@loja.com`)
- Senha: o valor de `ADMIN_PASSWORD` no `.env` do backend (padrão `Admin@123`)

Acesse o painel em `/admin` depois de logar.

## Stack

- **Backend:** Node.js, Express, TypeORM, MySQL, JWT
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router

## Licença

Este projeto está sob a licença MIT — veja [LICENSE](LICENSE).
