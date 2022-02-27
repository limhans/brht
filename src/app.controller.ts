import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NotificationChannel, NotificationTypeChannelMap, NotificationChannelMapper } from './models/notification.model';
import { AppService } from './app.service';
import { UiNotification } from './models/notification.model';
import { CreateNotificationRequest } from './types/CreateNotification';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Post()
    async createNotification(@Body() notification: CreateNotificationRequest) {
        const notificationDetails = NotificationTypeChannelMap[notification.type];
        const mappedChannels = notificationDetails.allowedChannels;

        // Get user and company channels
        const userChannels = await this.appService.getNotificationChannelByUserId(notification.userId);
        const compChannels = await this.appService.getNotificationChannelByCompanyId(notification.companyId);

        // Cross check the mapped channels with the subscribed channels
        const allowedChannels = mappedChannels.filter((element) => {
          return compChannels.includes(element) && userChannels.includes(element);
        });

        // if any channel matches, send the message via the channel
        if (allowedChannels.length > 0) {
          const promisses = allowedChannels.map(element => {
            return this.appService[NotificationChannelMapper[element]](notification, notificationDetails);
          });

          await Promise.all(promisses);

          return { success: true };
        }
        
        return { success: false, reason: 'Notification Channel for that type is not allowed'};
    }

    @Get('/ui/:userId')
    async getUiNotificationOfUser(@Param() params): Promise<UiNotification[] | null> {
      const { userId } = params;

      const notifications = await this.appService.retrieveUiNotificationsForUser(userId);

      return notifications;
    }
}
