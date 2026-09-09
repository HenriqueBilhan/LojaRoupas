import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from "typeorm";
import { Category } from "./Category";
import { ProductVariant } from "./ProductVariant";
import { OrderItem } from "./OrderItem";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 180 })
  name!: string;

  @Index({ unique: true })
  @Column({ length: 200 })
  slug!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "int" })
  priceCents!: number;

  @Column({ type: "int", nullable: true })
  comparePriceCents?: number;

  @Column("simple-array", { nullable: true })
  images!: string[];

  @Column({ default: 0 })
  stock!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isFeatured!: boolean;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "categoryId" })
  category?: Category;

  @Column({ nullable: true })
  categoryId?: string;

  @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
  variants!: ProductVariant[];

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems!: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
