

// This is user dto used to serialize 

// Serializing means to give access to limited information to user 

// This can happen by using "Expose()" to user 


import { Expose } from "class-transformer";

export class UserDto {

    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    email: string;

    


}