import { NotificationType } from "./NotificationType";

export type CreateNotificationRequest = {
    companyId: number;
    userId: number;
    type: NotificationType;
}