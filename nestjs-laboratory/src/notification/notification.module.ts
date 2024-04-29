import { Module } from '@nestjs/common';
import { NotificationServiceSlack } from './notification.service';

@Module({ providers: [NotificationServiceSlack] })
export class NotificationModule {}
