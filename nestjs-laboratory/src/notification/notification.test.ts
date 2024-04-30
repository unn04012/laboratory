import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import EventEmitter2 from 'eventemitter2';
import { OrderCreateEvent } from '../common';

import { NotificationServiceSlack } from './notification.service';

describe('notification slack test', () => {
  let notificationService: NotificationServiceSlack;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [NotificationServiceSlack],
    }).compile();
    app.createNestApplication();
    await app.init();

    notificationService = app.get<NotificationServiceSlack>(NotificationServiceSlack);
    eventEmitter = app.get(EventEmitter2);
  });

  test('OrderCreatd 이벤트가 발생할 때 메서드가 호출이 되어야 한다.', async () => {
    const mockedMethod = jest.spyOn(notificationService, 'orderCreated');

    const eventData = 'hello world';

    await eventEmitter.emitAsync(OrderCreateEvent.Topic(), eventData);

    expect(mockedMethod).toHaveBeenCalled();
    expect(mockedMethod).toHaveBeenCalledWith(eventData);
  });

  test('OrderCreatd 이벤트가 발생할 때 비동기로 호출할 emitAsync할 경우 모두 끝날때까지 기다린다.', async () => {
    const mockedMethod = jest.spyOn(notificationService, 'orderCreated');
    const mockedMethod2 = jest.spyOn(notificationService, 'orderCreatedTwoSecondsDelay');

    const eventData = 'hello world';
    const startTime = performance.now();
    await eventEmitter.emitAsync(OrderCreateEvent.Topic(), eventData);
    const endTime = performance.now();

    console.log((endTime - startTime) / 1000);

    expect(mockedMethod).toHaveBeenCalled();
    expect(mockedMethod2).toHaveBeenCalledWith(eventData);
  });
});
