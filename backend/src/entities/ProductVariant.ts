import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./Product";

@Entity("product_variants")
export class ProductVariant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column()
  productId!: string;

  @Column({ length: 20, nullable: true })
  size?: string;

  @Column({ length: 40, nullable: true })
  color?: string;

  @Column({ default: 0 })
  stock!: number;

  @Column({ nullable: true, length: 60 })
  sku?: string;
}
