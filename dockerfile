FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5004

CMD [ "npm", "run", "dev" ]
