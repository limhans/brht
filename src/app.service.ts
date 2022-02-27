import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import * as mongoose from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './types/User';
import { Company } from './types/Company';
import { NotificationChannel } from './models/notification.model';
import axios from 'axios';
import { UiNotification } from './models/notification.model';
import { CreateNotificationRequest } from './types/CreateNotification';
import { NotificationMapperType } from './types/NotificationMapper';


@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel(UiNotification) private readonly uiNotificationModel: ReturnModelType<typeof UiNotification>
  ) {}

  async emailNotificationChannel(notification: CreateNotificationRequest, details: NotificationMapperType): Promise<boolean> {
    // Call UserAPI with userId
    const user = await this.getUser(notification.userId);

    // Get Email from User Service
    this.logger.log(`Sending email to <${user.firstName} ${user.lastName}@${user.email}>...`);
    this.logger.log(`Subject is '${details.subject}'`);
    this.logger.log(`Body is: ${details.content}`);
    return Promise.resolve(true);
  }

  async uiNotificationChannel(notification: CreateNotificationRequest, details: NotificationMapperType): Promise<boolean> {
    const item = new this.uiNotificationModel({
        companyId: notification.companyId, 
        userId: notification.userId, 
        message: details.content,
        retrieved: false
    });
    await item.save();

    this.logger.log(`UI Notification for UserID ${notification.userId} was created.`);

    return Promise.resolve(true);
  }

  async getUser(userId: number): Promise<User | null> {
    const user = await axios.get<User>(`http://briohr-notify-mockoon:3003/user/${userId}`);
    return user.data;
  }

  async getCompany(companyId: number): Promise<Company | null> {
    const company = await axios.get<Company>(`http://briohr-notify-mockoon:3003/company/${companyId}`);
    return company.data;
  }
  
  async getNotificationChannelByUserId(userId: number): Promise<NotificationChannel[] | null> {
    // Call UserAPI with userId
    const { notificationChannels } = await this.getUser(userId);
    return notificationChannels;
  }

  async getNotificationChannelByCompanyId(companyId: number): Promise<NotificationChannel[] | null> {
    const { notificationChannels } = await this.getCompany(companyId);
    return notificationChannels;
  }

  async changeUiNotificationStatus(notificationsIds: mongoose.Types.ObjectId[]): Promise<void> {
    const promisses = notificationsIds.map((notificationId) => {
      return this.uiNotificationModel.findOneAndUpdate({ _id: notificationId }, { retrieved: true });
    });

    Promise.all(promisses);
  }

  async retrieveUiNotificationsForUser(userId: number): Promise<UiNotification[]> {
    const notifications = await this.uiNotificationModel.find({ userId, retrieved: false });

    // Set those notifications to retrieved
    this.changeUiNotificationStatus(notifications.map((notification) => { return notification._id }));

    return notifications;
  }
}
