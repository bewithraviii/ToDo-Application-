import { IsBoolean } from "class-validator";

export class CheckdTodoDto {

    @IsBoolean()
    isChecked: boolean;    

}