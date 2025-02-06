import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  private_key: string;

  @CreateDateColumn({
    nullable: false,
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  created_at: Date;

  constructor(address: string, private_key: string) {
    this.address = address;
    this.private_key = private_key;
  }

  static of(address: string, private_key: string) {
    return new User(address, private_key);
  }
}
