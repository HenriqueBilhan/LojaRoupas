-- Script de criação do banco de dados da loja.
-- Execute no MySQL Workbench, phpMyAdmin, ou deixe o docker-compose.yml
-- rodar isso automaticamente na primeira subida do container.
--
-- As TABELAS são criadas/atualizadas automaticamente pelo TypeORM
-- (synchronize: true em src/data-source.ts) quando o backend inicia.
-- Este arquivo cuida apenas da criação do banco em si.

CREATE DATABASE IF NOT EXISTS loja_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE loja_db;
