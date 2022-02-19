FROM node:14

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i -g @nestjs/cli
RUN npm install

COPY . .

CMD [ -d "node_modules" ] && npm run start:debug || npm install && npm run start:debug