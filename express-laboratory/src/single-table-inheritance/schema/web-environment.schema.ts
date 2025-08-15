import { ChildEntity, Column } from 'typeorm';
import { EnvironmentTranslation, RefEnvironmentEntity } from './environment.schema';

@ChildEntity('web')
export class WebEnvironmentEntity extends RefEnvironmentEntity {
  @Column({ type: 'simple-json', nullable: true })
  browser: EnvironmentTranslation[] | null;
}
