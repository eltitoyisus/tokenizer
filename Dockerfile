
FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["node", "code/create_token.js"]
