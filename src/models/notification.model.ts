import { prop } from '@typegoose/typegoose';
import { NotificationMapperType } from 'src/types/NotificationMapper';

export enum NotificationType {
    'LEAVE_BALANCE_REMINDER' = 'leave-balance-reminder',
    'MONTHLY_PAYSLIP' = 'monthly-payslip',
    'HAPPY_BIRTHDAY' = 'happy-birthday'
}

export enum NotificationChannel {
    'email' = 'email',
    'ui' = 'ui'
}

export const NotificationTypeChannelMap:{[key:string]:NotificationMapperType} = {
    'leave-balance-reminder': {
        'allowedChannels': [NotificationChannel.ui],
        'content': 'You have some unused leave. Please use it ASAP!',
    },
    'monthly-payslip': {
        'allowedChannels': [NotificationChannel.email],
        'content': 'Hey your payslip is ready.',
        'subject': 'Your Payslip is ready!',
    },
    'happy-birthday': {
        'allowedChannels': [NotificationChannel.email, NotificationChannel.ui],
        'content': 'Happy Birthday #FIRST_NAME#',
        'subject': 'Happy Birthday',
    },
}

export const NotificationChannelMapper = {
    "email": 'emailNotificationChannel',
    "ui": 'uiNotificationChannel'
}

export class UiNotification {
    @prop({ required: true })
    companyId: number;

    @prop({ required: true})
    userId: number;

    @prop({ required: true })
    message: string;

    @prop()
    retrieved: boolean;
}