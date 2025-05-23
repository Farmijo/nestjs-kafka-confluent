/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { Injectable, Logger } from '@nestjs/common';
import * as Kafka from 'node-rdkafka';

interface RDKafkaOptions {
  brokers: string;
  groupId: string;
  clientId: string;
  topics: string[];
  fromBeginning?: boolean;
  sasl?: {
    mechanism: 'scram-sha-512' | 'scram-sha-256' | 'plain';
    username: string;
    password: string;
  };
  ssl?: boolean;
  autoCommitInterval?: number;
}

@Injectable()
export class RDKafkaServer extends Server implements CustomTransportStrategy {
  protected readonly logger = new Logger(RDKafkaServer.name);
  private consumer: Kafka.KafkaConsumer;

  constructor(private readonly options: RDKafkaOptions) {
    super();
  }

  async listen(callback: () => void) {
    const kafkaConfig: Kafka.ConsumerGlobalConfig = {
      'metadata.broker.list': this.options.brokers,
      'group.id': this.options.groupId,
      'client.id': this.options.clientId,
      'enable.auto.commit': true,
      'auto.commit.interval.ms': this.options.autoCommitInterval ?? 5000,
    };

    if (this.options.ssl) {
      kafkaConfig['security.protocol'] = 'sasl_ssl';
    } else if (this.options.sasl) {
      kafkaConfig['security.protocol'] = 'sasl_plaintext';
    }

    if (this.options.sasl) {
      kafkaConfig['sasl.mechanisms'] = this.options.sasl.mechanism;
      kafkaConfig['sasl.username'] = this.options.sasl.username;
      kafkaConfig['sasl.password'] = this.options.sasl.password;
    }

    this.consumer = new Kafka.KafkaConsumer(kafkaConfig, {
      'auto.offset.reset': this.options.fromBeginning ? 'earliest' : 'latest',
    });

    this.consumer.on('ready', () => {
      this.logger.log('Kafka consumer ready. Subscribing to topics...');
      this.consumer.subscribe(this.options.topics);
      this.consumer.consume();
      callback();
    });

    this.consumer.on('data', async (message: Kafka.Message) => {
      const topic = message.topic;
      const value = message.value?.toString() ?? '{}';
      const handler = this.getHandlerByPattern(topic);

      if (!handler) {
        this.logger.warn(`No handler for topic: ${topic}`);
        return;
      }

      try {
        const payload = JSON.parse(value);
        await handler(payload);
      } catch (err) {
        this.logger.error(`Error parsing message from ${topic}`, err);
      }
    });

    this.consumer.on('event.error', (err) => {
      this.logger.error('Kafka error:', err);
    });

    this.consumer.connect();
  }

  close() {
    this.consumer.disconnect();
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
