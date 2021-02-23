import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swagger = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('documents', app, swagger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use('/public', express.static(join(__dirname, '..', 'public')));
  await app.listen(3000);
}
bootstrap();
