import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = parseInt(process.env.PORT, 10) || 7000;
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));

  await app.listen(port);
}
bootstrap();
