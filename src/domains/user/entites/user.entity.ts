import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  private_key: string;

  @Column({ nullable: true })
  meta_address: string;

  @CreateDateColumn({
    nullable: false,
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  created_at: Date;

  constructor(address: string, private_key?: string) {
    // private_key는 선택적 파라미터
    this.address = address;
    if (private_key) {
      this.private_key = private_key;
    }
  }

  static of(address: string, private_key?: string) {
    return new User(address, private_key);
  }
}
