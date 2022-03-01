import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should be able to retrieve a ui notification, after creating it', async () => {
    const notificationPayload = {
      companyId: 123,
      userId: 123,
      type: 'leave-balance-reminder',
    };

    await request(app.getHttpServer())
      .post('/')
      .send(notificationPayload)
      .expect(201)
      .expect({ success: true });

    return request(app.getHttpServer())
      .get('/ui/123')
      .expect(200)
      .expect((res) => expect(res.body.length).toBeGreaterThanOrEqual(1));
  });
});
