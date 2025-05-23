import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { argv } from 'yargs';
import { kafkaStrategies } from './kafka.strategies';

async function bootstrap() {
  const { kafkaLibrary } = argv as unknown as { kafkaLibrary: string };
  if (!kafkaLibrary) throw new Error('Consumer not found');
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: kafkaStrategies[kafkaLibrary].strategy(),
  });

  await app.listen();
}
bootstrap();
