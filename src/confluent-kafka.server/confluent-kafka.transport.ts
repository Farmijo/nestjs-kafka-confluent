/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { Injectable, Logger } from '@nestjs/common';
const { Kafka, logLevel } = require('@confluentinc/kafka-javascript').KafkaJS;

interface ConfluentKafkaOptions {
  brokers: string[];
  clientId: string;
  ssl: boolean;
  sasl?: {
    mechanism: 'scram-sha-512' | 'plain' | 'scram-sha-256';
    username: string;
    password: string;
  };
  groupId: string;
  topics: string[];
  fromBeginning?: boolean;
  autoCommitInterval?: number;
}

@Injectable()
export class ConfluentKafkaServer
  extends Server
  implements CustomTransportStrategy
{
  protected readonly logger = new Logger(ConfluentKafkaServer.name);
  private consumer;

  constructor(private readonly options: ConfluentKafkaOptions) {
    super();
  }

  async listen(callback: () => void) {
    const kafka = new Kafka({
      kafkaJS: {
        brokers: this.options.brokers,
        clientId: this.options.clientId,
        logLevel: logLevel.INFO,
      },
    });

    this.consumer = kafka.consumer({
      kafkaJS: {
        groupId: this.options.groupId,
        allowAutoTopicCreation: true,
      },
    });

    await this.consumer.connect();

    for (const topic of this.options.topics) {
      await this.consumer.subscribe({
        topic,
      });
    }

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const value = message.value?.toString();
        const handler = this.getHandlerByPattern(topic);
        if (!handler) {
          this.logger.warn(`No handler for topic: ${topic}`);
          return;
        }

        try {
          const data = JSON.parse(value || '{}');
          await handler(data);
        } catch (err) {
          this.logger.error(`Error parsing message from ${topic}:`, err);
        }
      },
    });

    this.logger.log(
      `Kafka consumer connected to ${this.options.brokers.join(', ')}`,
    );
    callback();
  }

  async close() {
    await this.consumer.disconnect();
  }

  on<
    EventKey extends string = string,
    EventCallback extends Function = Function,
  >(event: EventKey, callback: EventCallback) {
    throw new Error('Not implemented');
  }

  unwrap<T>(): T {
    throw new Error('Not implemented');
  }
}
