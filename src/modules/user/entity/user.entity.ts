import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column('varchar', { length: 320, unique: true })
  email: string;

  @Column('varchar', { length: 175 })
  password: string;
}
