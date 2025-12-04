
FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Por defecto, iniciar shell interactivo
# Permite ejecutar comandos dentro del contenedor
CMD ["/bin/bash"]
