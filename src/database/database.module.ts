import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LinkRepository } from 'src/database/database.service';

import { Link, LinkSchema } from './entities/link.entity';

@Module({
  providers: [LinkRepository],
  imports: [
    MongooseModule.forFeature([ 
      {
        name: Link.name,
        schema: LinkSchema
      }
    ])
  ],
  exports: [LinkRepository]
})
export class DatabaseModule {}

