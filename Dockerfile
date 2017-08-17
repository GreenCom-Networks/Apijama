FROM node:8.2.1-alpine

ENV APP apijama

COPY . /$APP/

RUN apk update \
    && apk add make gcc g++ python mongodb \
    && npm install -g pm2 \
    && cd /$APP/back \
    && npm install \
    && cd /$APP/front \
    && npm install \
    && npm rebuild node-sass --force

CMD cd /$APP/back && pm2 start index.js && cd /$APP/front && pm2 start npm -- run docker && mongod

EXPOSE 80

