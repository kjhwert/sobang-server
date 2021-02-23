import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimeDimension {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  db_date: Date;

  @Column()
  year: number;

  @Column()
  month: number;

  @Column()
  day: number;

  @Column()
  quarter: number;

  @Column()
  week: number;

  @Column()
  day_name: string;

  @Column()
  month_name: string;

  @Column()
  holiday_flag: string;

  @Column()
  weekend_flag: string;

  @Column()
  event: string;
}
