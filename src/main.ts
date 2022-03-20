import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT, 10) || 7000;
  app.enableCors();

  await app.listen(port);
}
bootstrap();
