import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RDKafkaServer } from './node-rdkafka/node-rdkafka.transport';
import { ConfluentKafkaServer } from './confluent-kafka.server/confluent-kafka.transport';

const kafkaStrategies = {
  confluent: {
    strategy: new ConfluentKafkaServer({
      brokers: ['localhost:9092'],
      clientId: 'nestjs-client',
      ssl: false,
      groupId: 'nestjs-group',
      topics: ['salesforce-contract', 'salesforce-opportunity'],
      fromBeginning: false,
      autoCommitInterval: 5000,
    }),
  },

  rdkafka: {
    strategy: new RDKafkaServer({
      brokers: 'localhost:9092',
      clientId: 'nestjs-client',
      ssl: false,
      groupId: 'nestjs-group',
      topics: ['salesforce-contract', 'salesforce-opportunity'],
      fromBeginning: false,
      autoCommitInterval: 5000,
    }),
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: kafkaStrategies.confluent.strategy,
  });

  await app.listen();
}
bootstrap();
