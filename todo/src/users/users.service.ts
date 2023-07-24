import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from "@nestjs/common/exceptions";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>){}


    createUser(name: string, email: string, password: string)
    {
        try
        {
            const user = this.repo.create({ name, email, password})
            return this.repo.save(user);
        }
        catch(err)
        {
            return err;
        }
        
    }


    findUserById(id: number)
    {
        if(!id)
        {
            throw new BadRequestException('You have to provide User Id, it is required field');
        }
        const user = this.repo.findOneBy({ id });
        return user;
        
    }
 
    findUserByEmail(email: string)
    {
        if(!email)
        {
            throw new BadRequestException('You have to provide User Email, it is required field');
        }
        const user = this.repo.findOneBy({ email });
        return user;
    }


    find(email: string)
    {
        return this.repo.find({ where: { email } })
    }




    findallUser(email: string)
    {
        if(!email)
        {
            throw new BadRequestException('Must Provide Email');
        }
        const users = this.repo.find({ where: { email } })
        if(!users)
        {
            throw new NotFoundException('No users are associated with this email');
        }
        return users;
    }


    async updateUser(id: number, attr: Partial<User>) 
    {
        const user = await this.findUserById(id);
        if(!user)
        {
            throw new NotFoundException('Cannot Update because user Not Found');
        }

        Object.assign(user, attr)
        return this.repo.save(user);
    }


    async deleteUser(id: number)
    {
        const user = await this.findUserById(id);
        if(!user)
        {
            throw new NotFoundException('Cannot Delete because user Not Found');
        }

        return this.repo.remove(user);
    }

}
