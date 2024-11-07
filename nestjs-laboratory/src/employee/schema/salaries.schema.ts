import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('salaries')
export class SalariesSchema {
  @PrimaryColumn({ name: 'emp_no', type: 'int' })
  public empNo: number;

  @Column({ type: 'int', nullable: false })
  public salary: number;

  @PrimaryColumn({ name: 'from_date', type: 'date' })
  public fromDate: Date;

  @Column({ name: 'to_date', type: 'date', nullable: false })
  public toDate: Date;
}
