import { IsOptional, IsNumber, IsString} from "class-validator";

export class UpdateTodoDto {

    @IsString()
    @IsOptional()
    text: string;
 
    @IsString()
    @IsOptional()
    date: string;
    
    @IsNumber()
    @IsOptional()
    priority: number;


}