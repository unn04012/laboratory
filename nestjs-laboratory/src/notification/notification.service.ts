import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreateEvent } from '../common/order-create-event';

@Injectable()
export class NotificationServiceSlack {
  constructor() {}

  @OnEvent(OrderCreateEvent.Topic(), { async: true, promisify: true })
  public async orderCreated(data: any) {
    return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
  }

  @OnEvent(OrderCreateEvent.Topic(), { async: true, promisify: true })
  public async orderCreatedTwoSecondsDelay(data: any) {
    return new Promise((resolve) => setTimeout(() => resolve(data), 2000));
  }
}
