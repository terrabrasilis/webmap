# Run to test image
# docker run -d --rm --name terrabrasilis_webmap terrabrasilis/webmap:v2.0.7
FROM node:12.8.1 as node

WORKDIR /app

ARG BUILD_TYPE
ARG ENV
ARG env=$ENV

COPY package.json /app/
RUN npm install
COPY ./src /app/src/
COPY ./ts*.json /app/
COPY ./angular.json /app/
COPY ./browserslist /app/
COPY ./nginx-custom.conf /app/nginx-custom.conf

RUN npm run build-$BUILD_TYPE && rm -rf /app/node_modules

FROM nginx:1.13

RUN rm -rf /usr/share/nginx/html/*

COPY --from=node /app/dist/terrabrasilis /usr/share/nginx/html/

COPY --from=node /app/nginx-custom.conf /etc/nginx/conf.d/default.conf
