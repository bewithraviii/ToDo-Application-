import { Min, Max, IsNumber, IsString, MinLength} from "class-validator";

export class CreateTodoDto {

    @IsString()
    @MinLength(6)
    text: string;
 
    @IsString()
    date: string;
    
    @IsNumber()
    @Min(1)
    @Max(3)
    priority: number;


}