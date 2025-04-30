import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateLinkDto {

    @ApiProperty({name: 'url', type: "string"})
    @IsString()
    url: string;

}
