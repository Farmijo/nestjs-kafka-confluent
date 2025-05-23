import { ConfluentKafkaServer } from './confluent-kafka.server/confluent-kafka.transport';
import { RDKafkaServer } from './node-rdkafka/node-rdkafka.transport';

export const kafkaStrategies = {
  confluent: {
    strategy: () => {
      return new ConfluentKafkaServer({
        brokers: ['localhost:9092'],
        clientId: 'nestjs-client',
        ssl: false,
        groupId: 'nestjs-group',
        topics: ['salesforce-contract', 'salesforce-opportunity'],
        fromBeginning: false,
        autoCommitInterval: 5000,
      });
    },
  },

  rdkafka: {
    strategy: () => {
      return new RDKafkaServer({
        brokers: 'localhost:9092',
        clientId: 'nestjs-client',
        ssl: false,
        groupId: 'nestjs-group',
        topics: ['salesforce-contract', 'salesforce-opportunity'],
        fromBeginning: false,
        autoCommitInterval: 5000,
      });
    },
  },
};
