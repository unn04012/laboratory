import { EventType, IEvent } from './event.interface';

export class Subscriber {
  private _sendData: any;

  constructor(private readonly _name: string, private readonly _eventType: EventType, private readonly _event: IEvent) {
    this._event.subscribe(this._eventType, (data: any) => {
      try {
        console.log(`${this._name} send data: ${data}, eventType: ${this._eventType}`);

        this._sendData = data; // 데이터를 갱신
      } catch (err) {
        console.log(err.message);
      }
    });
  }
}
