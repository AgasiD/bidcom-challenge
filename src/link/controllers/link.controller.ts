import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Redirect, Put } from '@nestjs/common';

import { LinkService } from '../link.service';
import { CreateLinkDto } from '../dto/create-link.dto';
import { UpdateLinkDto } from '../dto/update-link.dto';
import { DatePipe } from 'src/common/pipes/date-pipe';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RedirectQueryDTO } from '../dto/query-password.dto';

@ApiTags('links')
@Controller('api/links')
export class LinkController {
  constructor(private readonly linkService: LinkService) { }

  @ApiResponse({ status: 200, description: 'Stats.' })
  @ApiResponse({ status: 404, description: 'URL no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno' })
  @Get(':enmaskId/stats')
  obtenerEstadisticas(@Param('enmaskId') enmaskId: string) {
    return this.linkService.obtenerEstadisticas(enmaskId);
  }

  @ApiResponse({ status: 201, description: 'Link creado éxitosamente.' })
  @ApiResponse({ status: 404, description: 'URL no encontrada.' })
  @ApiResponse({ status: 409, description: 'URL ya existente.' })
  @ApiQuery({ name: 'password', required: false })
  @Post()
  create(@Body(DatePipe) createLinkDto: CreateLinkDto, @Query() query?: RedirectQueryDTO) {
    return this.linkService.crearLink(createLinkDto, query?.password);
  }

  @ApiResponse({ status: 200, description: 'URL invalidada con éxito.' })
  @ApiResponse({ status: 404, description: 'URL no encontrada.' })
  @Put()
  update(@Body() updateLinkDto: UpdateLinkDto) {
    return this.linkService.invalidarLink(updateLinkDto.url!);
  }
}
