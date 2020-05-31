import { Column, PrimaryGeneratedColumn, Index, PrimaryColumn, OneToOne, JoinColumn, Entity, BeforeInsert, Exclusion, OneToMany, BaseEntity } from 'typeorm';
@Entity({ name: 'userdetail' })
export class UserDetail extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    post_code: string;

    @Column()
    house_number: string;

    @Column()
    address_line: string;

    @Column()
    mobile: string;

    @Column()
    full_name: string;
}