import { EventCallback, EventType, IEvent } from './event.interface';

export type SubscriberByEventType = {
  [event in EventType]: EventCallback[];
};

export class EventDefault implements IEvent {
  private readonly _subscribers: SubscriberByEventType;

  constructor() {
    this._subscribers = {
      ORDER_CREATED: [],
      ORDER_FINISHED: [],
      ORDER_PAID: [],
    };
  }

  public subscribe(event: EventType, executor: EventCallback): void {
    this._subscribers[event].push(executor);
  }

  public publish(eventType: EventType, data: any): void {
    this._subscribers[eventType].forEach((subscriber) => subscriber(data));
  }
}
