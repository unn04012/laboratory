import { Inject, Injectable } from '@nestjs/common';
import { Symbols } from '../symbols';
import { IConfigReader } from './config-reader.interface';
import { KafkaOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class KafkaConfig {
  private readonly _port: number;
  private readonly _host: string;

  private readonly _broker: string;

  constructor(@Inject(Symbols.configReader) readonly reader: IConfigReader) {
    this._port = Number(reader.read('KAFKA_PORT'));
    this._host = reader.read('KAFKA_HOST');

    this._broker = `${this._host}:${this._port}`;
    console.log(this._broker);
  }

  public get port() {
    return this._port;
  }

  public get host() {
    return this._host;
  }

  public get defaultConsumerKafkaOption(): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [this._broker],
        },

        consumer: {
          groupId: 'peter-group',
          retry: {
            retries: 5,
            initialRetryTime: 300,
          },
        },
      },
    };
  }

  public get defaultKafkaProducerOption(): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [this._broker],
        },
      },
    };
  }

  /**
   * 멱등성 kafka option
   */
  public get defaultKafkaIdempotentProducerOption(): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [this._broker],
        },
        producer: {
          idempotent: true,
          // allowAutoTopicCreation: true,
          maxInFlightRequests: 5, //  ACK를 받지 않은 상황에서 하나의 커넥션에서 보낼 수 있는 최대 요청 수
        },
      },
    };
  }
}
