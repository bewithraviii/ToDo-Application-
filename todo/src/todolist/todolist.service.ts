import { Body, Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './dtos/Create-Todo.dto';
import { UpdateTodoDto } from './dtos/Update-Todo.dto';
import { Todo } from './todo.entity';

@Injectable()
export class TodolistService {

    constructor(@InjectRepository(Todo) private repo: Repository<Todo>){}


    async createTodo(todo: CreateTodoDto, userID: number)
    {
        const userTodo = await this.repo.create(todo);
        userTodo.userIdentity = userID;
        return this.repo.save(userTodo);
    }


    async changeIsChecked(id: number, Checked: boolean, userIdentity: number)
    {
        if(!userIdentity)
        {
            throw new NotFoundException('This user cannot edit this todo')
        }
        else
        {
            const userTodo = await this.repo.findOne({where: { id, userIdentity } });
            if(!userTodo)
            {
                throw new NotFoundException('Todo for this user does not find');
            }
    
            if(userTodo.isChecked === true)
            {
                throw new BadRequestException('Cannot modify checked TodoList.')
            }
            else
            {
                userTodo.isChecked = Checked;
                return this.repo.save(userTodo);
            }
        }
        
    }


    async changeTodoData(id: number, attr: Partial<Todo>, userIdentity: number)
    {
        if(!userIdentity)
        {
            throw new BadRequestException('This user cannot edit this todo');
        }
        else
        {
            const userTodo = await this.repo.findOne({where: { id, userIdentity } });
            if(!userTodo)
            {
                throw new NotFoundException('Todo for this user does not find');
            }

            Object.assign(userTodo, attr)
            return this.repo.save(userTodo);
        }
        
    }


    async findTodoById(id: number)
    {
        if(!id)
        {
            throw new NotFoundException('Todo for this user does not find')
        }
        else
        {
            const userTodo = await this.repo.find({where: { id } });
            return userTodo;
        }
        
    }

    
    async findTodoByUserID(userIdentity: number)
    {
        // const userTodo = await this.repo.find({where: { userIdentity } });
        // if(!userTodo)
        // {
        //     throw new NotFoundException('Todo for this userID does not find');
        // }
        // return userTodo;
        if(!userIdentity)
        {
            throw new NotFoundException('Todo for this userID does not find');
        }
        else
        {
            return this.repo.createQueryBuilder()
            .select('*')
            .where('userIdentity = :userIdentity', { userIdentity })
            .orderBy('priority', 'ASC')
            .getRawMany()
        }
        
    }


    async removeTodo(id: number, userIdentity: number)
    {
        if(!userIdentity)
        {
            throw new BadRequestException('This user cannot remove this todo');
        }
        else
        {
            const todo = await this.repo.findOne({where: { id, userIdentity } });
            if(!todo)
            {
                throw new NotFoundException('Todo for this user does not find');
            }
            
            console.log(`Todo removed for TodoId:${id} of UserId:${userIdentity}`);
            return this.repo.remove(todo);
        }

    }


}
