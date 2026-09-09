import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";

@Entity("cart_items")
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column()
  productId!: string;

  @ManyToOne(() => ProductVariant, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "variantId" })
  variant?: ProductVariant;

  @Column({ nullable: true })
  variantId?: string;

  @Column({ type: "int", default: 1 })
  quantity!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
