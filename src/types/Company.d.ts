import { NotificationChannel } from '../models/notification.model';

export type Company = {
  companyId: number;
  companyName: string;
  notificationChannels: NotificationChannel[];
  users: number[];
};
