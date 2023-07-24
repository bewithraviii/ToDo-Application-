import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../users/users.service';
import { AuthService } from '../users/auth.service';
import { User } from '../users/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {

    fakeUsersService = {
      findUserByEmail: (email: string) => {
        return Promise.resolve({ id: 5, name: 'asdf', email: email, password: 'zxcv1234'} as User)
      },
      findUserById: (id: number) => {
        return Promise.resolve({ id: id, name: 'asdf', email: 'test@gmail.com', password: 'zxcv1234'} as User)
      },
      updateUser: (id: number, attr: User) => {
        return Promise.resolve({ id: id, name: attr.name, email: attr.email , password: 'asdf1234'} as User)
      },
      deleteUser: (id: number) => {
        return Promise.resolve({ id: id, name: 'asdf', email: 'test@gmail.com', password: 'zxcv1234'} as User)
      }
    }


    fakeAuthService = {
      signup: (name: string,email: string, password: string) => {
        return Promise.resolve({ name, email, password } as User)
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email: email, password: password } as User)
      }

    }


    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });





  it('Find user with provided Email', async () => {
    const user = await controller.userwithemail('test@gmail.com');
    expect(user).toBeDefined();
    expect(user.email).toEqual('test@gmail.com')
  })


  it('Find user with provided Email in Query', async () => {
    const user = await controller.userwithemailQuery('asdf@gmail.com');
    expect(user).toBeDefined();
    console.log(user);
  })


  it('Update the user ', async () => {
    const user = await controller.updateUser('2', { name: 'Ravi', email: 'prirav@gmail.com'});
    expect(user).toBeDefined();
    console.log(user);
  })


  it('find user with email throw error when user not found', (done) => {
    fakeUsersService.findUserByEmail = () => null;
    controller.userwithemail('jgjh@gmail.com')
    .then(() => {
      done('Expected an error but did not get one')
    })
    .catch((err) => {
      done();
    })
    
  })


  it('Delete the user', async () => {
    const user = await controller.removeUser('1');
    expect(user).toBeDefined();
    console.log(user);
  })


  it('User Sign in Successfull', async () => {
    const Session = { userId: 0};
    const user = await controller.userSignIn({ email: 'asdf@gmail.com', password: 'zxcv1111234'}, Session);
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(Session.userId).toEqual(user.id);
    console.log(user);
  })

  it('User Sign up Successfull', async () => {
    const Session = { userId: 0};
    const user = await controller.userSignUp({ name: 'ved',email: 'ved@gmail.com', password: '32165487'}, Session);
    expect(user).toBeDefined();
    expect(Session.userId).toEqual(user.id);
    console.log(user);
  })

});
