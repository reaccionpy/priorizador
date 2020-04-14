FROM node:lts-alpine AS build
WORKDIR /html
COPY . /html
RUN cd /html && yarn install && yarn build

FROM nginx:1.17 AS base
RUN mkdir /etc/nginx/cache
USER root

FROM base AS final
WORKDIR /home
COPY --from=build /html/build /usr/share/nginx/html
EXPOSE 8080
