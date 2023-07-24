import { IsEmail, IsString, IsNumber, IsNotEmpty, MinLength } from "class-validator";

export class UserSignUpDto{


    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

}