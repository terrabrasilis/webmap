# Run to test image
# docker run --rm --name terrabrasilis_webmap terrabrasilis/webmap:<version>
FROM node:12.8.1 as node

# to monitor the health of the running service based on this container
RUN apt-get update \
  && apt-get install -y curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
COPY ./src /app/src/
COPY ./ts*.json /app/
COPY ./angular.json /app/
COPY ./browserslist /app/

ARG BUILD_TYPE
ARG ENV
ARG env=$ENV
COPY ./nginx-${BUILD_TYPE}.conf /app/nginx-custom.conf
RUN npm run build-${BUILD_TYPE} && rm -rf /app/node_modules

FROM nginx:1.21-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=node /app/dist/terrabrasilis /usr/share/nginx/html/

COPY --from=node /app/nginx-custom.conf /etc/nginx/conf.d/default.conf
