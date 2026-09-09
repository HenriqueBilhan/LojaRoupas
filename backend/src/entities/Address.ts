import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @Column({ length: 150 })
  recipientName!: string;

  @Column({ length: 9 })
  zipCode!: string;

  @Column({ length: 150 })
  street!: string;

  @Column({ length: 20 })
  number!: string;

  @Column({ length: 100, nullable: true })
  complement?: string;

  @Column({ length: 100 })
  neighborhood!: string;

  @Column({ length: 100 })
  city!: string;

  @Column({ length: 2 })
  state!: string;

  @Column({ default: false })
  isDefault!: boolean;
}
