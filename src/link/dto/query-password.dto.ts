import { IsOptional, IsString } from "class-validator";

export class RedirectQueryDTO{
    
    @IsString()
    @IsOptional()
    password?: string;
}