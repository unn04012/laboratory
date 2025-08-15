import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { InquiryEntity } from './inquiry.schema';

export type EnvironmentTranslation = {
  name: string;
  countryCode: string;
};

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class RefEnvironmentEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  //   @OneToMany(() => InquiryEntity, (inquiry) => inquiry.environment)
  //   inquiries: InquiryEntity[];
}
