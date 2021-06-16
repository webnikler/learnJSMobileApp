import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3333;

  const config = new DocumentBuilder()
    .setTitle('LearnJSMobileApp Api')
    .setVersion('0.0.1')
    .build();

  app.setGlobalPrefix(globalPrefix);

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
