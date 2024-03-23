import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('titles')
export class TitlesEntity {
  @PrimaryColumn()
  public empNo: number;

  @Column({
    length: 50,
  })
  public title: string;

  @Column({
    type: 'timestamp',
  })
  public fromDate: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  public toDate: Date;
}
