import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EquipmentCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  description: string;
}
