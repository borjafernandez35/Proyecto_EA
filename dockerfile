# Utiliza una imagen base de Node.js
FROM node:16-bullseye

# Instala TypeScript globalmente en la imagen
RUN npm install -g typescript

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY . .
RUN npm install

# Copia el código fuente de tu proyecto al contenedor
COPY . .

# Compila TypeScript a JavaScript
RUN tsc

# Expone el puerto en el que la aplicación escucha
EXPOSE 9090

# Comando para iniciar la aplicación (usando el archivo JavaScript)
CMD ["npm", "start"]