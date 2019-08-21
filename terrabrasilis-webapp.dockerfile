FROM node:9.2.0 as node

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app/

ARG BUILD_TYPE
ARG ENV

ARG env=$ENV

RUN npm run start-build-$BUILD_TYPE

FROM nginx:1.13

RUN rm -rf /usr/share/nginx/html/*

COPY --from=node /app/dist/ /usr/share/nginx/html/

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf