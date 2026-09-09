import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Product } from "./Product";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 120 })
  slug!: string;

  @Column({ nullable: true, type: "text" })
  description?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: 0 })
  sortOrder!: number;

  @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "parentId" })
  parent?: Category | null;

  @Column({ nullable: true })
  parentId?: string;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
