FROM node:lts-alpine AS build
WORKDIR /html
COPY . /html
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ARG REACT_APP_DASH_URL
ENV REACT_APP_DASH_URL=$REACT_APP_DASH_URL
RUN cd /html && yarn install && yarn build

FROM nginx:1.17 AS base
RUN mkdir /etc/nginx/cache
USER root

FROM base AS final
WORKDIR /home
COPY --from=build /html/build /usr/share/nginx/html
EXPOSE 8080
