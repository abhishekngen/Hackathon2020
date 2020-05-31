import { Column, PrimaryGeneratedColumn, Index, PrimaryColumn, OneToOne, JoinColumn, Entity, BeforeInsert, Exclusion, OneToMany, BaseEntity } from 'typeorm';
@Entity({ name: 'user' })
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    pass: string;

    @Column()
    helper: boolean;
}