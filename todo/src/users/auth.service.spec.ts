import { Test } from "@nestjs/testing";
import { resolve } from "path";
import { async } from "rxjs";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";



describe('AuthService Testing', () => {
    let service: AuthService;
    let fakeUserService: Partial<UsersService>;

    beforeEach(async () => {
        // Create fake UserService(mock implementation)
        const users: User[] = [];
        fakeUserService = {
            findallUser: (email: string) => {
                const filteredUser = users.filter((user) => { user.email === email })
                return Promise.resolve(filteredUser)
            },
            findUserByEmail: (email: string) => {
                const filteredUser = users.find((user) => { user.email === email });
                return Promise.resolve(filteredUser)
            },
            createUser: (name: string, email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 99),
                    name: name,
                    email: email,
                    password: password
                } as User;
                users.push(user);
                return Promise.resolve(user);
            }
            // findallUser: () => Promise.resolve([]),
            // findUserByEmail: (email: string) => Promise.resolve({
            //     id: 1,
            //     name: "name",
            //     email: email,
            //     password: "password"
            //   } as User),
            // createUser: (name: string, email: string, password: string) => Promise.resolve({ name, email, password } as User)
        }
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService
                }
            ]
        }).compile();
    
        service = module.get(AuthService);
    })
    
    
    it('can create an instance of auth service', async () => {
    
        expect(service).toBeDefined();
    })



    it('Create New User with Salted and Hashed password', async () => {
       const user = await service.signup('Ravi', 'test@gmail.com', 'zxcv1234');

        //Creating Test Scenery
        expect(user.password).not.toEqual('zxcv1234');
        const [salt, hash] = user.password.split('.');

        // if salt or hash will be undefined then 
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();

    })


    it('Throw error if user signup with email already used', (done) => {
        
        fakeUserService.findallUser = () => Promise.resolve([{id: 1, name: "Ravi", email: "test@gmail.com", password: "zxcv1234"} as User])

        service.signup('Ravi', 'test@gmail.com', 'zxcv1234')
        .then(() => {
        // This block will not be executed since the signup function is expected to throw an error.
        done('Expected an error but did not get one.');
        })
        .catch((err) => {
        // This block will be executed when the signup function throws an error.
        done();
        });
 
     });



     it('Throw error if user signin is called with unused email', (done) => {
        service.signin('asdfhjbvchb@gmail.com', '1234safdas')
        .then(() => {
            done('Expected an error but did not get one.');
        })
        .catch((err) => {
            done();
        })
     })



     it('throw error if invalid password is provided', (done) => {
        fakeUserService.findUserByEmail = () => Promise.resolve({email: "test123456@gmail.com", password: "zxcv1234"} as User)
        service.signin('test123456@gmail.com', 'jvbsbdvdhbv')
        .then(() => {
            done('Expected an error but did not get one.');
        })
        .catch(() => {
            done();
        })
     })


     it('return a user if correct password is provided', async () => {
        // fakeUserService.findUserByEmail = () => Promise.resolve({email: "test123456@gmail.com", password: "zxcv1234"} as User)
        // const user = await service.signin('test123456@gmail.com', 'jvbsbdvdhbv');
        // expect(user).toBeDefined();
        const userdetail = await service.signup('akshay','asdf@gmail.com', 'zxcv1234');
        fakeUserService.findUserByEmail = () => Promise.resolve({email: "asdf@gmail.com", password: `${userdetail.password}`} as User)
        const user = await service.signin('asdf@gmail.com', 'zxcv1234')
        expect(user).toBeDefined();
        
     })
})


