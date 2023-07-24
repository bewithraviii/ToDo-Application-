import { Todo } from '../todolist/todo.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    
    // @OneToMany(() => Todo, (todo) => todo.user)
    // todos: Todo[]
}