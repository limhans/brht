import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getModelToken } from 'nestjs-typegoose';
import { ModuleTokenFactory } from '@nestjs/core/injector/module-token-factory';
import { CreateNotificationRequest } from './types/CreateNotification';
import { NotificationType, UiNotification } from './models/notification.model';
import { ReturnModelType } from '@typegoose/typegoose';
import axios from 'axios';
import { User } from './types/User';

const mockRepository = {
  async find() {
    return [];
  },
};

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AppController', () => {
  let app: TestingModule;
  let appService: AppService;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: getModelToken('UiNotification'),
          useValue: mockRepository,
        },
        AppService,
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('create notification', () => {
    it('should return { success: true } if a notification was succesfully created', async () => {
      // User has the notification channel and company as well
      const appController = app.get<AppController>(AppController);

      const successBody: CreateNotificationRequest = {
        companyId: 111,
        userId: 111,
        type: NotificationType.HAPPY_BIRTHDAY,
      };

      const user = {
        userId: 111,
        firstName: 'John',
        lastName: 'Tester',
        dob: '1900-01-01',
        email: 'tester@test.test',
        notificationChannels: ['ui', 'email'],
      };

      const company = {
        companyId: 111,
        companyName: 'Test Ltd.',
        notificationChannels: ['email', 'ui'],
        users: [111],
      };

      mockedAxios.get.mockImplementation((url) => {
        switch (url) {
          case 'http://briohr-notify-mockoon:3003/user/111':
            return Promise.resolve({ data: user });
          case 'http://briohr-notify-mockoon:3003/company/111':
            return Promise.resolve({ data: company });
          default:
            return Promise.reject(new Error('not found'));
        }
      });

      jest
        .spyOn(appService, 'uiNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));
      jest
        .spyOn(appService, 'emailNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));

      expect(await appController.createNotification(successBody)).toEqual({
        success: true,
      });
      expect(appService.uiNotificationChannel).toBeCalled();
      expect(appService.emailNotificationChannel).toBeCalled();
    });

    it('should return { success: false } if a notification failed to be created', async () => {
      // User has the notification channel and company as well
      const appController = app.get<AppController>(AppController);

      const successBody: CreateNotificationRequest = {
        companyId: 111,
        userId: 111,
        type: NotificationType.HAPPY_BIRTHDAY,
      };

      const user = {
        userId: 111,
        firstName: 'John',
        lastName: 'Tester',
        dob: '1900-01-01',
        email: 'tester@test.test',
        notificationChannels: [],
      };

      const company = {
        companyId: 111,
        companyName: 'Test Ltd.',
        notificationChannels: [],
        users: [111],
      };

      mockedAxios.get.mockImplementation((url) => {
        switch (url) {
          case 'http://briohr-notify-mockoon:3003/user/111':
            return Promise.resolve({ data: user });
          case 'http://briohr-notify-mockoon:3003/company/111':
            return Promise.resolve({ data: company });
          default:
            return Promise.reject(new Error('not found'));
        }
      });

      jest
        .spyOn(appService, 'uiNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));
      jest
        .spyOn(appService, 'emailNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));

      expect(await appController.createNotification(successBody)).toEqual({
        success: false,
        reason: 'Notification Channel for that type is not allowed',
      });
      expect(appService.uiNotificationChannel).not.toBeCalled();
      expect(appService.emailNotificationChannel).not.toBeCalled();
    });

    it('should only call email notification if user is only subscribed to email', async () => {
      // User has the notification channel and company as well
      const appController = app.get<AppController>(AppController);

      const successBody: CreateNotificationRequest = {
        companyId: 111,
        userId: 111,
        type: NotificationType.HAPPY_BIRTHDAY,
      };

      const user = {
        userId: 111,
        firstName: 'John',
        lastName: 'Tester',
        dob: '1900-01-01',
        email: 'tester@test.test',
        notificationChannels: ['email'],
      };

      const company = {
        companyId: 111,
        companyName: 'Test Ltd.',
        notificationChannels: ['email', 'ui'],
        users: [111],
      };

      mockedAxios.get.mockImplementation((url) => {
        switch (url) {
          case 'http://briohr-notify-mockoon:3003/user/111':
            return Promise.resolve({ data: user });
          case 'http://briohr-notify-mockoon:3003/company/111':
            return Promise.resolve({ data: company });
          default:
            return Promise.reject(new Error('not found'));
        }
      });

      jest
        .spyOn(appService, 'uiNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));
      jest
        .spyOn(appService, 'emailNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));

      expect(await appController.createNotification(successBody)).toEqual({
        success: true,
      });
      expect(appService.uiNotificationChannel).not.toBeCalled();
      expect(appService.emailNotificationChannel).toBeCalled();
    });

    it('should only call ui notification if company is only subscribed to ui', async () => {
      // User has the notification channel and company as well
      const appController = app.get<AppController>(AppController);

      const successBody: CreateNotificationRequest = {
        companyId: 111,
        userId: 111,
        type: NotificationType.HAPPY_BIRTHDAY,
      };

      const user = {
        userId: 111,
        firstName: 'John',
        lastName: 'Tester',
        dob: '1900-01-01',
        email: 'tester@test.test',
        notificationChannels: ['email', 'ui'],
      };

      const company = {
        companyId: 111,
        companyName: 'Test Ltd.',
        notificationChannels: ['ui'],
        users: [111],
      };

      mockedAxios.get.mockImplementation((url) => {
        switch (url) {
          case 'http://briohr-notify-mockoon:3003/user/111':
            return Promise.resolve({ data: user });
          case 'http://briohr-notify-mockoon:3003/company/111':
            return Promise.resolve({ data: company });
          default:
            return Promise.reject(new Error('not found'));
        }
      });

      jest
        .spyOn(appService, 'uiNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));
      jest
        .spyOn(appService, 'emailNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));

      expect(await appController.createNotification(successBody)).toEqual({
        success: true,
      });
      expect(appService.uiNotificationChannel).toBeCalled();
      expect(appService.emailNotificationChannel).not.toBeCalled();
    });

    it('should only send email for monthly-payslip', async () => {
      // User has the notification channel and company as well
      const appController = app.get<AppController>(AppController);

      const successBody: CreateNotificationRequest = {
        companyId: 111,
        userId: 111,
        type: NotificationType.MONTHLY_PAYSLIP,
      };

      const user = {
        userId: 111,
        firstName: 'John',
        lastName: 'Tester',
        dob: '1900-01-01',
        email: 'tester@test.test',
        notificationChannels: ['email', 'ui'],
      };

      const company = {
        companyId: 111,
        companyName: 'Test Ltd.',
        notificationChannels: ['ui', 'email'],
        users: [111],
      };

      mockedAxios.get.mockImplementation((url) => {
        switch (url) {
          case 'http://briohr-notify-mockoon:3003/user/111':
            return Promise.resolve({ data: user });
          case 'http://briohr-notify-mockoon:3003/company/111':
            return Promise.resolve({ data: company });
          default:
            return Promise.reject(new Error('not found'));
        }
      });

      jest
        .spyOn(appService, 'uiNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));
      jest
        .spyOn(appService, 'emailNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));

      expect(await appController.createNotification(successBody)).toEqual({
        success: true,
      });
      expect(appService.uiNotificationChannel).not.toBeCalled();
      expect(appService.emailNotificationChannel).toBeCalled();
    });

    it('should only create ui notification for leave-balance-reminder', async () => {
      // User has the notification channel and company as well
      const appController = app.get<AppController>(AppController);

      const successBody: CreateNotificationRequest = {
        companyId: 111,
        userId: 111,
        type: NotificationType.LEAVE_BALANCE_REMINDER,
      };

      const user = {
        userId: 111,
        firstName: 'John',
        lastName: 'Tester',
        dob: '1900-01-01',
        email: 'tester@test.test',
        notificationChannels: ['email', 'ui'],
      };

      const company = {
        companyId: 111,
        companyName: 'Test Ltd.',
        notificationChannels: ['ui', 'email'],
        users: [111],
      };

      mockedAxios.get.mockImplementation((url) => {
        switch (url) {
          case 'http://briohr-notify-mockoon:3003/user/111':
            return Promise.resolve({ data: user });
          case 'http://briohr-notify-mockoon:3003/company/111':
            return Promise.resolve({ data: company });
          default:
            return Promise.reject(new Error('not found'));
        }
      });

      jest
        .spyOn(appService, 'uiNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));
      jest
        .spyOn(appService, 'emailNotificationChannel')
        .mockImplementationOnce(() => Promise.resolve(true));

      expect(await appController.createNotification(successBody)).toEqual({
        success: true,
      });
      expect(appService.uiNotificationChannel).toBeCalled();
      expect(appService.emailNotificationChannel).not.toBeCalled();
    });

    it('should return unretrieved ui notifications, if there are any', async () => {
      // User has the notification channel and company as well
      const appController = app.get<AppController>(AppController);

      const notificationResponse = [
        {
          companyId: 111,
          userId: 111,
          message: 'Some Message',
          retrieved: false,
        },
      ];

      jest
        .spyOn(mockRepository, 'find')
        .mockImplementationOnce(() => Promise.resolve(notificationResponse));

      expect(
        await appController.getUiNotificationOfUser({ userId: 111 }),
      ).toEqual(notificationResponse);
      expect(mockRepository.find).toBeCalled();
    });

    it('should return empty array, if no unretrieved', async () => {
      // User has the notification channel and company as well
      const appController = app.get<AppController>(AppController);

      jest
        .spyOn(mockRepository, 'find')
        .mockImplementationOnce(() => Promise.resolve([]));

      expect(
        await appController.getUiNotificationOfUser({ userId: 111 }),
      ).toEqual([]);
      expect(mockRepository.find).toBeCalled();
    });
  });
});
