import { Injectable } from "@nestjs/common";
import { BadRequestException, NotFoundException } from "@nestjs/common/exceptions";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    constructor(private usersServices: UsersService) {}

    async signup(name: string, email: string, password: string)
    {
        // Checking Email already Exists 
        const checkEmail = await this.usersServices.findallUser(email);
        if(checkEmail.length > 0)
        {
            throw new BadRequestException('User with this email already exists');
        }
        try
        {
            // Creating salt for password
            const salt = randomBytes(2).toString('hex');

            // Creating Hash from password
            const hash = (await scrypt(password, salt, 8)) as Buffer;

            // Merging Salt and hash to secure password
            const HashedPassword = salt + '.' + hash.toString('hex');


            // Passing NAME, EMAIL and HASH-Password to create method
            const addUser = await this.usersServices.createUser(name, email, HashedPassword);

            return addUser;
        }
        catch(err)
        {
            return err;
        }
       
    }


    async signin(email: string, password: string)
    {   
    
        // Getting User from DB with email
        const findUser = await this.usersServices.findUserByEmail(email);
        if(!findUser)
        {
            throw new NotFoundException('User Does not found, Please enter correct email');
        }

        // Seperating User Password into "SALT" and "HASH"
        const [salt, storedhash] = findUser.password.split(".");
        const derivedSALT = salt;
        const derivedHASH = storedhash;

        // Creating Hash for Comparing Stored password and entered password
        const creatingHash = (await scrypt(password, derivedSALT, 8)) as Buffer;

        // Comparison Of INPUT and Stored Password
        if(derivedHASH !== creatingHash.toString('hex'))
        {
            throw new BadRequestException('Password does not match, Please Provide Correct One')
        }
        else 
        {
            return findUser;
        }

    }

}