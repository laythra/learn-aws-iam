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
ENV VITE_APP_ENV=$VITE_APP_ENV

RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
