import { ChildEntity, Column } from 'typeorm';
import { EnvironmentTranslation, RefEnvironmentEntity } from './environment.schema';

@ChildEntity('app')
export class AppEnvironmentEntity extends RefEnvironmentEntity {
  @Column({ type: 'simple-json', nullable: true })
  os: EnvironmentTranslation[] | null;
}
