import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from 'src/common/exception-handle/http.filter';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './common/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    secret: 'your_secret_key',  // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },  // Set `true` in production with HTTPS
  }));
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  SwaggerModule.setup('twitter', app, createDocument(app));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
