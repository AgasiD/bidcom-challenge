import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class CreateLinkDto {

    @ApiProperty({name: 'url', type: "string"})
    @IsString()
    @IsUrl({require_protocol: true, require_valid_protocol: true},{message: 'Link no es un URL válido'})
    url: string;

    @ApiProperty({name: 'expires', type: "string"})
    @IsDateString({}, {message: "Formato de fecha debe ser 'aaaa-mm-dd'"})
    @IsOptional()
    @MinLength(6, { message: 'La fecha debe tener al menos 6 caracteres'})
    expires?: Date



}
