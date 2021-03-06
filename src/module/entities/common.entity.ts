import { Column } from 'typeorm';

export class CommonEntity {
  @Column({ default: 1, select: false })
  status: number;

  @Column({ nullable: true, select: false })
  createdId: number;

  //TODO 2020-10-10 03:03:03 으로 저장하도록
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true, select: false })
  updatedId: number;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;
}
