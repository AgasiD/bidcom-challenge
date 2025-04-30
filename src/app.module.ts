import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkModule } from './link/link.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import mongoose from 'mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`env/bidcom.env`],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_CNN!, {
      dbName: process.env.BD_NAME,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { 
          limit: 10, 
          ttl: 30 * 1000 
        }] // limito a 10 solicitudes por IP cada 30 segundos
    }),
    LinkModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    mongoose.connection.on('connected', () => {
      console.log('✅ Conexión a MongoDB establecida');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Error en la conexión a MongoDB:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Conexión a MongoDB cerrada');
    });
  }
}
