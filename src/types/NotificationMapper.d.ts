import { NotificationChannel } from "src/models/notification.model";

export type NotificationMapperType = {
    allowedChannels: NotificationChannel[],
    content: string,
    subject?: string
}