FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN rm -rf dist && npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]