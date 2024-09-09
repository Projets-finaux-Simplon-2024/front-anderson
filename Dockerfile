# Utilise une image de base avec Node.js
FROM node:18 as build

# Définis le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste de l'application
COPY . .

# Construit l'application pour la production
RUN npm run build

# Utilise une image de base Nginx pour servir l'application
FROM nginx:alpine

# Copie les fichiers construits dans le répertoire Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose le port sur lequel l'application tournera
EXPOSE 3000

# Démarre Nginx
CMD ["nginx", "-g", "daemon off;"]
