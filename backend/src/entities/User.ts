import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Order } from "./Order";
import { CartItem } from "./CartItem";
import { Address } from "./Address";

export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 150 })
  name!: string;

  @Column({ unique: true, length: 180 })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ nullable: true, length: 20 })
  phone?: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => CartItem, (item) => item.user)
  cartItems!: CartItem[];

  @OneToMany(() => Address, (address) => address.user)
  addresses!: Address[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
