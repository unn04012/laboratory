import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductSchema } from './product-schema';

@Entity('product_order')
export class OrderSchema {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    length: 100,
    unique: true,
  })
  public orderId: string;

  @Column({
    type: 'int',
    default: 1,
    comment: '주문 갯수',
  })
  public count: number;

  @Column({
    type: 'int',
    comment: '상품 id(pk)',
  })
  public productId: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  public regDate: Date;

  @ManyToOne(() => ProductSchema, (schema) => schema.orders)
  @JoinColumn({ name: 'product_id' })
  product: ProductSchema;
}
