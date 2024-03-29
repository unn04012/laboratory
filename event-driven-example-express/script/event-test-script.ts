import { EventDefault } from '../src/event/event-default';
import { Subscriber } from '../src/event/subscriber';

const event = new EventDefault();
new Subscriber('orderCreateSubscirber1', 'ORDER_CREATED', event);

new Subscriber('orderCreateSubscirber2', 'ORDER_CREATED', event);

new Subscriber('Orderpaid1', 'ORDER_PAID', event);

setInterval(() => {
  event.publish('ORDER_CREATED', '주문 생성 구독자를 위한 이벤트 발생');
}, 1000);
