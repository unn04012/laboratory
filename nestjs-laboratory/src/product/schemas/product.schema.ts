import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { OrderSchema } from './order.schema';

@Entity('product')
export class ProductSchema {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    length: 50,
  })
  public name: string;

  @Column({
    type: 'int',
    comment: '입고량',
  })
  public receiveStock: number;

  @Column({
    type: 'int',
    comment: '남은 재고량',
  })
  public remainStock: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  public regDate: Date;

  @VersionColumn()
  public version: number;

  @OneToMany(() => OrderSchema, (schema) => schema.product)
  orders: OrderSchema[];
}
