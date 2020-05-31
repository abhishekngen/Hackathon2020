import { Column, PrimaryGeneratedColumn, Index, PrimaryColumn, OneToOne, JoinColumn, Entity, BeforeInsert, Exclusion, OneToMany, BaseEntity } from 'typeorm';
@Entity({ name: 'request' })
export class Request extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerID: number;

    @Column()
    helperID: number;

    @Column()
    requestBody: string;

    @Column({ type: 'timestamp', default: () => `now()` })
    created_at: Date;

    @Column()
    fulfilled: boolean;
}