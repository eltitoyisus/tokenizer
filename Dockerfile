
FROM debian:bookworm

RUN apt-get update && apt-get install -y \
    npm

WORKDIR /app

COPY package.json .

RUN npm install

CMD ["node", "index.js"]
