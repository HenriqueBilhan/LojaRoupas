# JW Store com MySQL

O backend foi configurado para usar MySQL com TypeORM.

## 1. Criar o banco

Abra o MySQL Workbench (ou outro cliente MySQL) e execute:

```sql
CREATE DATABASE IF NOT EXISTS loja_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

O TypeORM está com `synchronize: true`, então as tabelas serão criadas/atualizadas quando o backend iniciar.

## 2. Configurar o backend

Edite `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=loja_db
```

Se o seu MySQL tiver senha no usuário `root`, coloque-a em `DB_PASSWORD`.

## 3. Instalar dependências

```bash
cd backend
npm install
```

O driver usado é `mysql2`; o driver `pg` foi removido.

## 4. Iniciar

```bash
npm run dev
```

Depois, em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

## Importante

Não é necessário Docker para executar esta versão. Basta ter o MySQL Server instalado e rodando na porta 3306.
