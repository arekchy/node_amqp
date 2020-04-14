FROM node:13.12-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production
