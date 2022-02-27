import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getModelToken } from "nestjs-typegoose";
import { ModuleTokenFactory } from '@nestjs/core/injector/module-token-factory';
import { CreateNotificationRequest } from './types/CreateNotification';
import { NotificationType, UiNotification } from './models/notification.model';
import axios from 'axios';
import { User } from './types/User';

const fakeUiNotificationModel = jest.fn();

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AppController', () => {
  let app: TestingModule;
  let appService: AppService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: getModelToken("UiNotification"),
          useValue: fakeUiNotificationModel
        },
        AppService
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('create notification', () => {
    it('should return { success: true } if a notification was succesfully created', async () => {
      // User has the notification channel and company as well
      const appController = app.get<AppController>(AppController);
      
      const successBody:CreateNotificationRequest = {
        companyId: 111,
        userId: 111,
        type: NotificationType.HAPPY_BIRTHDAY
      };

      const user = {
        userId: 111,
        firstName: 'John',
        lastName: 'Tester',
        dob: '1900-01-01',
        email: 'tester@test.test',
        notificationChannels: ['ui', 'email']
      };

      const company = {
        "companyId": 111,
        "companyName": "Test Ltd.",
        "notificationChannels": ["email", "ui"],
        "users": [
          111
        ]
      }

      mockedAxios.get.mockImplementation((url) => {
        switch (url) {
          case 'http://briohr-notify-mockoon:3003/user/111':
            return Promise.resolve({data: user});
          case 'http://briohr-notify-mockoon:3003/company/111':
            return Promise.resolve({data: company});
          default:
            return Promise.reject(new Error('not found'));
        }
      });

      jest.spyOn(appService, 'uiNotificationChannel').mockImplementationOnce(() => Promise.resolve(true));

      expect(await appController.createNotification(successBody)).toEqual({ success: true });
    });

    it('should return { success: false } if a notification failed to be created', async () => {
      // User has the notification channel and company as well
      const appController = app.get<AppController>(AppController);
      
      const successBody:CreateNotificationRequest = {
        companyId: 111,
        userId: 111,
        type: NotificationType.HAPPY_BIRTHDAY
      };

      const user = {
        userId: 111,
        firstName: 'John',
        lastName: 'Tester',
        dob: '1900-01-01',
        email: 'tester@test.test',
        notificationChannels: []
      };

      const company = {
        "companyId": 111,
        "companyName": "Test Ltd.",
        "notificationChannels": [],
        "users": [
          111
        ]
      }

      mockedAxios.get.mockImplementation((url) => {
        switch (url) {
          case 'http://briohr-notify-mockoon:3003/user/111':
            return Promise.resolve({data: user});
          case 'http://briohr-notify-mockoon:3003/company/111':
            return Promise.resolve({data: company});
          default:
            return Promise.reject(new Error('not found'));
        }
      });

      jest.spyOn(appService, 'uiNotificationChannel').mockImplementationOnce(() => Promise.resolve(true));

      expect(await appController.createNotification(successBody)).toEqual({ success: false, reason: 'Notification Channel for that type is not allowed' });
    });
  });
});
