import { SQS } from 'aws-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { OrderCreateEvent } from '../common';

const getQueueNameDirectly = () => <string>process.env['EVENT_QUEUE_NAME'];

@Injectable()
export class ExternalEventGatewayService {
  constructor(@Inject(EventEmitter2) private readonly _eventEmitter: EventEmitter2) {}

  @SqsMessageHandler(getQueueNameDirectly(), false)
  public async onExternalMessageArrival(message: SQS.Message) {
    console.log('sqs message arrive');
    this._parseAndPublishInternal(message);
  }

  private _parseAndPublishInternal(message: SQS.Message) {
    if (!message.Body) return;
    const body: Record<string, any> = JSON.parse(message.Body);
    const { kind } = body;

    if (kind === 'ORDER_CREATE') {
      this._eventEmitter.emit(OrderCreateEvent.Topic());
    }
  }
}
