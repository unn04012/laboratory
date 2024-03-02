export type EventCallback = (payload: any) => Promise<any> | any;

export type EventType = 'ORDER_CREATED' | 'ORDER_PAID' | 'ORDER_FINISHED';

export interface IEvent {
  /**
   * 특정 이벤트를 구독합니다.
   * @param event
   * @param executor
   */
  subscribe(event: EventType, executor: EventCallback): void;

  /**
   * 이벤트를 발행합니다.
   * @param data
   */
  publish(event: EventType, data: any): void;
}
