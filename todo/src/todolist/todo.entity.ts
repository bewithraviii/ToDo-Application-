import { User } from '../users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


@Entity()
export class Todo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;
 
    @Column()
    date: string;
    
    @Column({ default: false })
    isChecked: boolean;
    
    @Column()
    priority: number;

    @Column()
    userIdentity: number;

    // @ManyToOne(() => User, (user) => user.todos)
    // user: User;

}