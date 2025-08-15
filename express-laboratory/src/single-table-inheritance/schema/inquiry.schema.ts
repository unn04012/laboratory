import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppEnvironmentEntity } from './app-environment.schema';
import { RefEnvironmentEntity } from './environment.schema';

export enum InquiryStatus {
  PENDING = 'pending',
  RESPONDED = 'answered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type Attachment = {
  type: 'image' | 'video';
  url: string;
};

@Entity('inquiry')
export class InquiryEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string;

  @ManyToOne(() => InquiryEntity, (inquiry) => inquiry.title, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  parentInquiry: InquiryEntity;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'enum', enum: InquiryStatus, nullable: false })
  status: InquiryStatus;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  attachments: Attachment[] | null;

  @ManyToOne(() => RefEnvironmentEntity, (entity) => entity.id, { nullable: false })
  @JoinColumn({ name: 'environmentId' })
  environment: AppEnvironmentEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  cancelledAt: Date;
}
