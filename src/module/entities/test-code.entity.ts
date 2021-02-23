import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TestCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  description: string;
}
