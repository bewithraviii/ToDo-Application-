import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodolistService } from './todolist.service';
import { TodolistController } from './todolist.controller';
import { Todo } from './todo.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodolistService],
  controllers: [TodolistController]
})
export class TodolistModule {}
