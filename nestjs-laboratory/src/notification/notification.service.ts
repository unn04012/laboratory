import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreateEvent } from '../common/order-create-event';

export class NotificationServiceSlack {
  constructor() {}

  @OnEvent(OrderCreateEvent.Topic(), { async: true })
  public async orderCreated() {
    console.log('hello world');
    console.log('notification slack');
  }
}
