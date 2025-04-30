import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateLinkDto } from 'src/link/dto/create-link.dto';

@Injectable()
export class DatePipe implements PipeTransform {



  transform(value: CreateLinkDto, metadata: ArgumentMetadata) {

    if( new Date(value.expires!).getTime() < Date.now() ) throw new BadRequestException('La fecha debe ser mayor al día de hoy')
  
    return value;
  }
}
