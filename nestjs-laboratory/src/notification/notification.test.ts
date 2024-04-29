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
      providers: [
        NotificationServiceSlack,
        // {
        //   provide: EventEmitter2,
        //   useValue: {
        //     emit: jest.fn(),
        //   },
        // },
      ],
    }).compile();
    app.createNestApplication();
    await app.init();

    notificationService = app.get<NotificationServiceSlack>(NotificationServiceSlack);
    eventEmitter = app.get(EventEmitter2);
  });

  test('OrderCreatd 이벤트가 발생할 때 메서드가 호출이 되어야 한다.', async () => {
    // const mockedMethod = jest.spyOn(notificationService, 'orderCreated');

    const eventData = {};
    eventEmitter.emit(OrderCreateEvent.Topic(), eventData);

    // expect(mockedMethod).toHaveBeenCalled();
  });
});
