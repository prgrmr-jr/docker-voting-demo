FROM node:lts-alpine3.22

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]