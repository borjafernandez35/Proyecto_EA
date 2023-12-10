# Utiliza una imagen base de Node.js
FROM node:16-bullseye

# Instala TypeScript globalmente en la imagen
RUN npm install -g typescript

# Añade la ubicación de TypeScript a la variable de entorno PATH
ENV PATH="/app/node_modules/.bin:${PATH}"

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Compila TypeScript a JavaScript
RUN rm -rf build/ && tsc

# Expone el puerto en el que la aplicación escucha
EXPOSE 9090

# Comando para iniciar la aplicación (usando el archivo JavaScript compilado)
CMD ["npm", "start"]