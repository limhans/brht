import { NotificationChannel } from '../models/notification.model';

export type User = {
  userId: number;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  notificationChannels: NotificationChannel[];
};
