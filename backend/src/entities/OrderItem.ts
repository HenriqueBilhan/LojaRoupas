import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "orderId" })
  order!: Order;

  @Column()
  orderId!: string;

  @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "productId" })
  product?: Product;

  @Column({ nullable: true })
  productId?: string;

  @Column({ length: 180 })
  productName!: string;

  @Column({ nullable: true, length: 20 })
  size?: string;

  @Column({ nullable: true, length: 40 })
  color?: string;

  @Column({ type: "int" })
  unitPriceCents!: number;

  @Column({ type: "int" })
  quantity!: number;
}
