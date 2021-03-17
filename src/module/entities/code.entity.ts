import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Code {
  static ACT = 1;
  static DELETE = 2;
  static ORGANIZATION = 3;
  static ADVISORY = 4;
  static ADMIN = 5;
  static PROCESS_WAIT = 6;
  static PROCESS_APPROVE = 7;
  static PROCESS_REJECT = 8;
  static PROCESS_COMPLETE = 9;
  static PROCESS_ALL = 10;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  description: string;
}
