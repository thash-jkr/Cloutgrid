#!/bin/bash

set -e

INFO="[\033[0;34m INFO \033[0m]"
SUCCESS="[\033[0;32m SUCCESS \033[0m]"
ERROR="[\033[0;31m ERROR \033[0m]"

echo "======================================"
echo "🚀 Starting Server Restart & Deploy"
echo "======================================"

echo -e "$INFO Fetching latest changes from Git..."
git pull origin main

if [ -d "frontend" ]; then
    echo -e "$INFO Building frontend React production bundle..."
    cd frontend
    npm install
    npm run build
    cd ..
    echo -e "$SUCCESS Frontend built successfully."
else
    echo -e "$ERROR Frontend directory not found! Skipping UI build."
fi

echo -e "$INFO Stopping current Docker containers..."
docker compose -f docker-compose.prod.yml down

echo -e "$INFO Rebuilding images and starting containers in detached mode..."
docker compose -f docker-compose.prod.yml up --build -d

echo -e "$INFO Checking for schema changes (makemigrations)..."
docker compose -f docker-compose.prod.yml exec -T backend python manage.py makemigrations --noinput

echo -e "$INFO Applying database migrations..."
docker compose -f docker-compose.prod.yml exec -T backend python manage.py migrate --noinput

echo -e "$SUCCESS Deploy completed! Verifying container status:"
docker compose -f docker-compose.prod.yml ps

echo "======================================"
echo -e "$SUCCESS Done"
echo "======================================"