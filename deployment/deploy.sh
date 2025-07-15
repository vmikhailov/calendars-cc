#!/bin/bash

# Variables
REPO_URL="https://github.com/vmikhailov/calendars-cc.git"
REPO_DIR=~/Projects/calendars-cc
DEPLOY_DIR=/var/www/calendars
NGINX_CONF=/etc/nginx/sites-available/calendars

set -e

SCRIPT_PATH="$(realpath "$0")"
BEFORE_MTIME=$(stat -c %Y "$SCRIPT_PATH")

# Clone or update repo
if [ ! -d "$REPO_DIR/.git" ]; then
  git clone $REPO_URL $REPO_DIR
fi

cd $REPO_DIR
git pull origin main

AFTER_MTIME=$(stat -c %Y "$SCRIPT_PATH")

if [ "$AFTER_MTIME" != "$BEFORE_MTIME" ]; then
  echo "deploy.sh updated, re-executing..."
  exec "$SCRIPT_PATH" "$@"
fi

echo "deploy.sh is the same, continuing..."

cd $REPO_DIR
git pull origin main

# Install dependencies
npm i
npm audit fix

# Build Angular app
ng build --configuration production

# Deploy build to server directory
sudo rm -rf $DEPLOY_DIR/*
sudo mkdir -p $DEPLOY_DIR
sudo cp -r dist/calendars-cc/browser/* $DEPLOY_DIR/
sudo chown -R $USER:$USER $DEPLOY_DIR

# Nginx config
sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    listen 80;
    server_name calendars.cc;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name calendars.cc;

    root /var/www/calendars;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/calendars.cc/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/calendars.cc/privkey.pem;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/calendars
sudo nginx -t
sudo systemctl reload nginx

echo "Deployment complete and Nginx configured."