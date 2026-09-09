# Banco de dados (MySQL)

O banco fica junto do backend porque é ele quem o utiliza. Duas formas de rodar:

## Opção 1 — Docker (recomendado)

Dentro desta pasta (`backend/database`):

```bash
docker compose up -d
```

Isso sobe:
- **MySQL 8** na porta `3306`, já criando o banco `loja_db` (via `init.sql`)
- **Adminer** (interface web) em `http://localhost:8080` para visualizar as tabelas

Credenciais padrão (ajuste em `docker-compose.yml` e em `backend/.env` se mudar):
- host: `localhost`
- usuário: `root`
- senha: `root`
- banco: `loja_db`

## Opção 2 — MySQL local (sem Docker)

1. Tenha o MySQL Server instalado e rodando na porta `3306`.
2. Execute o `init.sql` no MySQL Workbench, phpMyAdmin ou outro cliente:
   ```sql
   CREATE DATABASE IF NOT EXISTS loja_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Configure `backend/.env` com as credenciais do seu MySQL.

## Tabelas

As tabelas **não** precisam ser criadas manualmente: o TypeORM (`synchronize: true`
em `backend/src/data-source.ts`) cria e atualiza o schema automaticamente a
partir das entidades em `backend/src/entities` quando o backend inicia.

Para popular o banco com dados de exemplo (categorias, produtos e um admin):

```bash
cd backend
npm run seed
```
