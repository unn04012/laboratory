import { Events } from '.';

export class OrderCreateEvent {
  public static Topic() {
    return Events.internalEvents.OrderCreated;
  }
}
