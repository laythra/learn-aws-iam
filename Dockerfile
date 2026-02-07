FROM node:22.14-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY .yarn .yarn
COPY .yarnrc.yml ./

RUN corepack enable && corepack prepare yarn@4.7.0 --activate

COPY yarn.lock ./
RUN yarn install --immutable

COPY . .

ARG VITE_APP_ENV=production
ARG VITE_ANALYTICS_URL

ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_ANALYTICS_URL=$VITE_ANALYTICS_URL


RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
