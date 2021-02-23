import { Column } from 'typeorm';

export class CommonEntity {
  @Column({ default: 1 })
  status: number;

  @Column()
  createdId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  updatedId: number;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;
}
