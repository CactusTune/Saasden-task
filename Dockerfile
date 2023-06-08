FROM node:19-alpine

COPY package.json /app/
COPY src /app/

WORKDIR /app

RUN npm install

ENV NODE_ENV production

CMD ["node", "-r", "dotenv/config", "server.js"]

#Run docker image
#docker build -t <image-name> .
#docker run -d -p 3000:3000 --env-file .env <image-name>