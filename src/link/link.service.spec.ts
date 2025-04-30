import { Test, TestingModule } from '@nestjs/testing';

import { CreateLinkDto } from './dto/create-link.dto';
import { LinkService } from './link.service';
import  * as helper from '../common/helpers/helpers';
import { DatabaseService } from '../database/database.service';

jest.mock('../common/helpers/helpers');

describe('LinkService', () => {
  let service: LinkService;
  let db: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkService,
        {
          provide: DatabaseService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LinkService>(LinkService);
    db = module.get<DatabaseService>(DatabaseService);
  });

  describe('crearLink', () => {
    it('debería crear un nuevo link', async () => {
      const mockDto = { url: 'http://google.com', expires: new Date() } as CreateLinkDto;
      (helper.cifrarCadena as jest.Mock).mockResolvedValue('hashedPass');
      const mockDbResponse = {
        toObject: () => ({
          _id: '1',
          enmaskUrl: 'fakeurl',
          originalUrl: 'https://google.com',
          expires: mockDto.expires,
          enmask: 'abc123',
          redirectCount: 0,
          isValid: true,
        }),
      };
      (db.create as jest.Mock).mockResolvedValue(mockDbResponse);

      const result = await service.crearLink(mockDto, '123');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('enmaskUrl');
    });
  });

  describe('obtenerLink', () => {
    it('debería devolver la url original si es válida', async () => {
      const fakeLink = {
        originalUrl: 'https://google.com',
        password: 'hashed',
        expires: Date.now() + 1000,
        redirectCount: 0,
      };
      (db.findOne as jest.Mock).mockResolvedValue(fakeLink);
      (helper.isCadenasIguales as jest.Mock).mockResolvedValue(true);
      (db.updateOne as jest.Mock).mockResolvedValue(true);

      const result = await service.obtenerLink('abc123', '123');
      expect(result).toBe(fakeLink.originalUrl);
    });

    it('debería lanzar error si el password no coincide', async () => {
      const fakeLink = {
        password: 'hashed',
        expires: Date.now() + 1000,
      };
      (db.findOne as jest.Mock).mockResolvedValue(fakeLink);
      (helper.isCadenasIguales as jest.Mock).mockResolvedValue(false);
      const result = await service.obtenerLink('abc123', '123');
      await expect(result).toBe(undefined);
    });
  });

  describe('invalidarLink', () => {
    it('debería marcar el link como inválido', async () => {
      (db.updateOne as jest.Mock).mockResolvedValue(true);
      const result = await service.invalidarLink('someurl');
      expect(result).toHaveProperty('success', true);
    });
  });

  describe('obtenerEstadisticas', () => {
    it('debería devolver el contador de redirecciones', async () => {
      const fakeLink = { redirectCount: 5 };
      (db.findOne as jest.Mock).mockResolvedValue(fakeLink);
      const result = await service.obtenerEstadisticas('abc123');
      expect(result).toEqual({ redirectCount: 5 });
    });
  });
});
