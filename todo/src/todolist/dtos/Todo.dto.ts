import { Expose } from "class-transformer"; 
import { IsString, IsNumber, IsBoolean } from "class-validator";

export class TodoDto {

    @IsNumber()
    id: number;

    @IsString()
    text: string;
 
    @IsString()
    date: string;
    
    @IsBoolean()
    isChecked: boolean;
    
    @IsNumber()
    priority: number;

    @IsNumber()
    userIdentity: number;

}