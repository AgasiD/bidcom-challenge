import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from 'src/database/database.service';

import { Link, LinkSchema } from './entities/link.entity';

@Module({
  providers: [DatabaseService],
  imports: [
    MongooseModule.forFeature([ 
      {
        name: Link.name,
        schema: LinkSchema
      }
    ])
  ],
  exports: [DatabaseService]
})
export class DatabaseModule {}

