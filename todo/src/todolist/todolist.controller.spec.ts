import { Test, TestingModule } from '@nestjs/testing';
import { TodolistController } from './todolist.controller';
import { TodolistService } from './todolist.service';
import { Todo } from './todo.entity';
import { async } from 'rxjs';

describe('TodolistController', () => {
  let controller: TodolistController;
  let fakeTodoServices: Partial<TodolistService>

  beforeEach(async () => {
    const todos: Todo[] = [];
    fakeTodoServices = {
      createTodo: (attr: Todo, id: number) => Promise.resolve({ date: attr.date, text: attr.text, priority: attr.priority} as Todo),
      findTodoById: (id: number) => Promise.resolve([ { id: id, text: 'this is users todo text', date: '12/02/23', isChecked: false, userIdentity: 5 , priority: 1 } as Todo ]),
      findTodoByUserID: (userIdentity: number) => Promise.resolve
      ([
        { id: 1, text: 'text1', date: '12/12/12', priority: 1, isChecked: false, userIdentity: userIdentity} as Todo,
        { id: 2, text: 'text2', date: '12/12/12', priority: 3, isChecked: true, userIdentity: userIdentity} as Todo
      ]),
      changeIsChecked: (id: number, Checked: boolean, userIdentity: number) => Promise.resolve({ id: id , text: 'this is users todo text', date: '12/02/23', isChecked: Checked, priority: 1 ,userIdentity: 5 } as Todo),
      changeTodoData: (id: number, attr: Todo, userIdentity: number) => Promise.resolve({ id: id, text: attr.text, date: attr.date, priority: attr.priority, userIdentity: userIdentity} as Todo),
      removeTodo: (id: number, userIdentity: number) => { return Promise.resolve( { id: id, userIdentity: userIdentity} as Todo) }
    }
  


    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodolistController],
      providers: [
        {
          provide: TodolistService,
          useValue: fakeTodoServices
        }
      ]
    }).compile();

    controller = module.get<TodolistController>(TodolistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('Create the User todo', async () => {
    const todo = await controller.createTODO({ text: 'alksjdhakfsd', date: '12/32/12', priority: 1}, 5)
    expect(todo).toBeDefined();
    console.log(todo);
  })


  it('Find todo by Id successfull', async () => {
    const todo = await controller.getTODObyId('5')

    expect(todo).toBeDefined();
    expect(todo[0].id).toEqual(5);
    expect(todo[0].userIdentity).toEqual(5);

  })


  it('Change Checked-In Successfull', async () => {
    const todo = await controller.updateTODOChecked( '10' , { isChecked: true }, '5' );
    // console.log(todo);

    expect(todo).toBeDefined();
    expect(todo.id).toEqual(10);
    expect(todo.userIdentity).toEqual(5);

  })


  it('Update User successfully', async () => {
    const Updateduser = controller.updateTODOData('5', { text: 'sfjshfg' , date: '12/02/23', priority: 3}, '5' );
    console.log(Updateduser);

    expect(Updateduser).toBeDefined();

  })


  it('Find user by UserId', async () => {

    // program to extract value as an array from an array of objects
    function extractValue(arr, prop) {

      // extract value from property
      let extractedValue = arr.map(item => item[prop]);

      return extractedValue;

    }

    const userTodo = await controller.getTODObyUserID('5');
    let extract = extractValue(userTodo, 'userIdentity')
    console.log(userTodo);
    console.log(extract);

    expect(userTodo).toBeDefined();
    expect(extract[0] && extract[1]).toEqual(5);
  })


  it('Remove Todo of User', async () => {
    const removeUserTodo = await controller.removeTodo( '1', '7');
    console.log(removeUserTodo);

    expect(removeUserTodo).toBeDefined();
  })

});