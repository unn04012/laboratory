import EventEmitter2 from 'eventemitter2';
import { Module } from '@nestjs/common';

@Module({ imports: [EventEmitter2] })
export class NotificationModule {}
