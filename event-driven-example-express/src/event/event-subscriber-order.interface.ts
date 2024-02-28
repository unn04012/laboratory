import { EventEmitter } from 'stream';
import { EventCallback, ISubscriber } from './event-subscriber.interface';

export class OrderSubscriber implements ISubscriber {
  constructor(private readonly _emitter: EventEmitter) {}

  public subscribe(event: string, executor: EventCallback): void {
    this._emitter.on(event, executor);
  }
}
