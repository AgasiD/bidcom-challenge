import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './controllers/link.controller';

import { DatabaseService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';
import { LController } from './controllers/l.controller';

@Module({
  controllers: [LinkController, LController],
  providers: [LinkService],
  imports: [DatabaseModule]

})
export class LinkModule {}
