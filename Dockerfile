FROM node:20-alpine

ENV NODE_ENV production

ENV APP_NAME authentication-dev

ENV PORT 3002

ENV DB_CONNECTION_URL "postgres://sridharsubramani@localhost:5432/postgres"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src src/
COPY tsconfig.json .

RUN npm run build

CMD [ "npm", "run", "start:prod" ]