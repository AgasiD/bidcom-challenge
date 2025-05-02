import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';

import { cifrarCadena, handleException, isCadenasIguales } from '../common/helpers/helpers';
import { CreateLinkDto } from './dto/create-link.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LinkService {

  constructor(
    private readonly db: DatabaseService
  ) { }

  async crearLink(linkDTO: CreateLinkDto, pass?: string) {
    try {

      const port = process.env.PORT ?? 8080;
      const enmask = randomBytes(8).toString('hex');
      const enmaskUrl = `http://localhost:${port}/l/${enmask}`;

      let data_link = {
        originalUrl: linkDTO.url,
        enmaskUrl: enmaskUrl,
        enmask,
        password: await cifrarCadena(pass),
        expires: linkDTO.expires,
        ts: Date.now()
      }

      let result = await this.db.create(data_link)

      const { _id, __v, redirectCount, isValid, password, ...rest } = result!.toObject();

      return { id: _id, ...rest };

    } catch (err) {
      handleException(err)
    }
  }


  async obtenerLink(enmaskId: string, password?: string) {
    try {

      let link = await this.buscarLinkByEnmaskId(enmaskId);

      if (link.password) {
        if (!(await isCadenasIguales(password, link.password))) {
          throw new NotFoundException('URL no encontrada')
        }
      }

      this.isExpirado(link);

      await this.sumarRedireccion(enmaskId)

      return link.originalUrl;

    } catch (err) {
      handleException(err)
    }
  }

  async invalidarLink(enmaskUrl: string) {
    try {

      let updated = await this.db.updateOne({ enmaskUrl: enmaskUrl, isValid: true }, { isValid: false, });
      return { success: updated, timestamp: Date.now() };

    } catch (err) {
      handleException(err);
    }
  }

  async obtenerEstadisticas(enmask: string) {
    try {
      let link = await this.buscarLinkByEnmaskId(enmask);

      return { redirectCount: link.redirectCount }
    } catch (err) {
      handleException(err)
    }
  }

  private async sumarRedireccion(enmask: string) {

    try {
      let link = await this.buscarLinkByEnmaskId(enmask);

      let response = await this.db.updateOne({ enmask: enmask }, { redirectCount: link.redirectCount + 1 });

      return response;

    } catch (err) {
      handleException(err);
    }

  }

  private isExpirado(link) {

    let expiracion = link.expires;
    if (expiracion < Date.now()) throw new NotFoundException('Link expirado')

    return false

  }

  private async buscarLinkByURL(url: string, isValid: boolean = true) {
    let link = await this.db.findOne({ originalUrl: url, isValid })
    if (!link) throw new NotFoundException(`URL no encontrada.`)
    return link
  }

  private async buscarLinkByEnmaskId(enmaskId: string, isValid: boolean = true) {
    let link = await this.db.findOne({ enmask: enmaskId, isValid })
    if (!link) throw new NotFoundException(`URL no encontrada.`)
    return link;
  }


}


