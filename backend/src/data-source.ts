import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { Category } from "./entities/Category";
import { Product } from "./entities/Product";
import { ProductVariant } from "./entities/ProductVariant";
import { CartItem } from "./entities/CartItem";
import { Order } from "./entities/Order";
import { OrderItem } from "./entities/OrderItem";
import { Address } from "./entities/Address";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Category, Product, ProductVariant, CartItem, Order, OrderItem, Address],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
