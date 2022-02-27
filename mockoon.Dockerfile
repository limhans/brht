FROM node:14

WORKDIR /usr/src/app

RUN npm i -g @mockoon/cli

COPY mockoon.data.json ./

CMD mockoon-cli start --data ./mockoon.data.json -D -t