import { EventDefault } from '../src/event/event-default';
import { Subscriber } from '../src/event/subscriber';

const event = new EventDefault();

const orderCreateSubscriber1 = (data: any) => {
  console.log(`Order Create Subscriber 1 received: data: ${data}`);
};

const orderPaidSubscriber1 = (data: any) => {
  console.log(`Order Paid Subscirber 1 received data: ${data} `);
};

event.subscribe('ORDER_CREATED', orderCreateSubscriber1);
event.subscribe('ORDER_PAID', orderPaidSubscriber1);

event.publish('ORDER_CREATED', '주문 생성 구독자를 위한 이벤트 발생');
