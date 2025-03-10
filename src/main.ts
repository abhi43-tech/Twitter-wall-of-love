import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from 'src/common/exception-handle/http.filter';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './common/swagger/swagger';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'your_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; connect-src 'self' http://localhost:3000",
    );
    next();
  });
  app.use(cors({
    origin: 'http://localhost:3001', // Frontend origin
    credentials: true, // Allow cookies to be sent
  }));
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  SwaggerModule.setup('twitter', app, createDocument(app));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
