FROM node:12.8.1 as node

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app/

ARG BUILD_TYPE
ARG ENV

ARG env=$ENV

RUN npm run build-$BUILD_TYPE

FROM nginx:1.13

RUN rm -rf /usr/share/nginx/html/*

COPY --from=node /app/dist/terrabrasilis /usr/share/nginx/html/

COPY nginx-custom-$BUILD_TYPE.conf /etc/nginx/conf.d/default.conf