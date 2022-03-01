import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UiNotification } from './models/notification.model';

@Module({
  imports: [
    TypegooseModule.forRoot(
      process.env.DB_URL || 'mongodb://localhost:27017/briohr-test',
    ),
    TypegooseModule.forFeature([UiNotification]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
