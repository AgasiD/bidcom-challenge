import { NestFactory } from '@nestjs/core';
import { BadRequestException, NotFoundException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        let val = errors.find(validation => validation.constraints?.isUrl);
        if (val) return new NotFoundException(`${val.constraints!.isUrl}`);
        const messages = errors.map(e => `${e.property} - ${Object.values(e.constraints!).join(', ')}`);
        return new BadRequestException(messages);
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Link tracker')
    .setDescription('Link Tracker es un sistema para tracker enmascarar URLs y poder obtener analítica de cuantas veces se llamó a cada uno de los links, así como también agregar reglas de negocio para el funcionamiento del redirect.')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
      origin: `http://localhost:${process.env.PORT}`
    });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
