FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias primero (para aprovechar la caché de Docker)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto
EXPOSE 4200

# El comando para iniciar lo definimos en el docker-compose.yml
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "500"]