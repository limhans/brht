FROM node:14

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i -g @nestjs/cli
RUN npm install

COPY . .

ENV API_URL=http://briohr-notify-mockoon:3003
ENV DB_URL=mongodb://mongodb.local:27017/briohr

CMD [ -d "node_modules" ] && npm run start:dev || npm install && npm run start:dev