@echo off

:: Pull l'image depuis GitHub Container Registry
docker pull ghcr.io/projets-finaux-simplon-2024/front-anderson:main

:: Supprimer le conteneur existant s'il existe déjà
docker rm -f container_anderson_front

:: Run le conteneur avec les variables d'environnement et le mapping de port
docker run -d -p 3000:80 --name container_anderson_front -e REACT_APP_BACK_API_URL="http://localhost:8080" ghcr.io/projets-finaux-simplon-2024/front-anderson:main

echo Le conteneur container_anderson_front est démarré et écoute sur le port 3000.
