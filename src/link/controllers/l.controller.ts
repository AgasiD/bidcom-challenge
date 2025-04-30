import { Controller, Get, Param, Query, Redirect, Scope } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LinkService } from '../link.service';
import { RedirectQueryDTO } from '../dto/query-password.dto';

@ApiTags('l')


@Controller('l')
export class LController {
  constructor(private readonly linkService: LinkService) { }

  @ApiResponse({ status: 404, description: 'URL no encontrada.' })
  @ApiResponse({ status: 307, description: 'Redirección.' })
  @ApiQuery({ name: 'password', required: false })
  @Get(':enmaskId')
  @Redirect()
  async redireccionar(@Param('enmaskId') enmaskId: string, @Query() query?: RedirectQueryDTO) {
    try {
      let url = await this.linkService.obtenerLink(enmaskId, query?.password)
      return { url, statusCode: 302 };
    }
    catch (err) {
      throw err;
    }
  }
}
