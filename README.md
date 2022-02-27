# Installation
`docker-compose up -d`

# Running the app
The app is automatically running with `npm start:dev` and hot-reload

# Access
App: `:3000`
MongoDB: `:27017`
External API: `:3003` (User and Company, this is one for sake of ease right now, should be seperate APIs at the end)

# Test
Unit Tests
`npm run test`

E2E Tests
`npm run test:e2e`

Test Coverage
`npm run test:cov`

# Add an additional Notification Type
1.) Add the new type in `models/notification.model.ts` in `NotificationType` and `NotificationTypeChannelMap`

# Add an additional Notification Channel
1.) Add the new channel in `models/notification.model.ts` in `NotificationChannel`
2.) Add usage in `NotificationTypeChannelMap.allowedChannels`
3.) Add the implementation for a new channel in `app.service.ts` as a new function
4.) Add the function name in `NotificationChannelMapper`