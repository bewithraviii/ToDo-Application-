import { Controller, Post, Get, Delete, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { Session } from '@nestjs/common/decorators';
import { CreateTodoDto } from './dtos/Create-Todo.dto';
import { CheckdTodoDto } from './dtos/Checked-Todo.dto';
import { UpdateTodoDto } from './dtos/Update-Todo.dto';
import { TodolistService } from './todolist.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import { ApiBody, ApiParam } from '@nestjs/swagger/dist/decorators';




@ApiTags('To-Do Section')
@Controller('todolist')
// @UseGuards(AuthGuard)
export class TodolistController {

    constructor(private todolistServices: TodolistService) {}




    @Post()
    @ApiOperation({ summary: 'Create new ToDo' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    example: 'anything you wand to add in TODO',
                    description: 'this is the todo'
                },
                date: {
                    type: 'string',
                    example: 'Date of adding this todo',
                    description: 'this is the date'
                },
                priority: {
                    type: 'integer',
                    example: '1',
                    description: 'this is the priority'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Todo Created successfully'
    })
    @ApiResponse({
        status: 403,
        description: 'Todo Not Created'
    })
    createTODO(@Body() body: CreateTodoDto, @Session() session: any)
    {
        return this.todolistServices.createTodo(body, session.userId);
    }





    @Get('/:id')
    @ApiOperation({ summary: 'Get Particular Todo from todo-ID' })
    @ApiResponse({
        status: 200,
        description: 'Data for this todoID is Fetched'
    })
    @ApiResponse({
        status: 403,
        description: 'Data with this TodoID not found'
    })
    getTODObyId(@Param('id') id: string)
    {
        return this.todolistServices.findTodoById(parseInt(id));
    }

    @Get()
    @ApiOperation({ summary: 'Get All Todo of UserID' })
    @ApiResponse({
        status: 200,
        description: 'Data for this UserID is Fetched'
    })
    @ApiResponse({
        status: 403,
        description: 'Data with this UserID not found'
    })
    async getTODObyUserID(@Query('userIdentity') userIdentity: string)
    {
        return this.todolistServices.findTodoByUserID(parseInt(userIdentity));
    }






    @Patch('/:id')
    @ApiOperation({ summary: 'Checked the completed Todo' })
    @ApiParam({
        name: 'id',
        type: 'integer',
        description: 'enter todoID for update',
        required: true
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                isChecked: {
                    type: 'boolean',
                    example: 'true',
                    description: 'this is the IsChecked'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Todo Checked Successfull'
    })
    @ApiResponse({
        status: 403,
        description: 'Todo Not Checked'
    })
    updateTODOChecked(@Param('id') id: string, @Body() body: CheckdTodoDto, @Session() session: any)
    {
        return this.todolistServices.changeIsChecked(parseInt(id), body.isChecked, session.userId);
    }

    @Patch()
    @ApiOperation({ summary: 'Update the Particular Todo' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    example: 'anything you wand to add in TODO',
                    description: 'this is the todo'
                },
                date: {
                    type: 'string',
                    example: 'Date of adding this todo',
                    description: 'this is the date'
                },
                priority: {
                    type: 'integer',
                    example: '1',
                    description: 'this is the priority'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Todo Updated Successfull'
    })
    @ApiResponse({
        status: 403,
        description: 'Todo Not Updated'
    })
    updateTODOData(@Query('id') id: string, @Body() body: UpdateTodoDto, @Session() session: any)
    {
        return this.todolistServices.changeTodoData(parseInt(id), body, session.userId);
    }





    
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete this Todo' })
    @ApiParam({
        name: 'id',
        type: 'integer',
        description: 'enter todoID for Delete',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'Todo Deleted Successfull'
    })
    @ApiResponse({
        status: 403,
        description: 'Todo Not Deleted'
    })
    removeTodo(@Param('id') id: string, @Session() session: any)
    {
        return this.todolistServices.removeTodo(parseInt(id), session.userId);
    }
}
