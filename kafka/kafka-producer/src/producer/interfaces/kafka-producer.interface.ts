export interface KafkaMessage {
  key?: string;
  value: string;
  headers?: Record<string, string>;
}

export interface IKafkaProducer {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(topic: string, messages: KafkaMessage[]): Promise<void>;
}
