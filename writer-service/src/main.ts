import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;

  await await app.listen(port, '0.0.0.0');
  console.log(`Listening on port ${port}`);
}
bootstrap();
