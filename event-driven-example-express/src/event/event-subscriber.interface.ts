export type EventCallback = (payload: any) => Promise<any> | any;

export interface ISubscriber {
  subscribe(event: string, executor: EventCallback): void;
}
