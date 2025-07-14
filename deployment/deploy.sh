#!/bin/bash

set -e

# Variables
REPO_URL="https://github.com/vmikhailov/calendars-cc.git"
REPO_DIR=~/Projects/calendars-cc
DEPLOY_DIR=/var/www/calendars
NGINX_CONF=/etc/nginx/sites-available/calendars

# Clone or update repo
if [ ! -d "$REPO_DIR/.git" ]; then
  git clone $REPO_URL $REPO_DIR
fi

cd $REPO_DIR
git pull origin main

# Install dependencies
npm i

# Build Angular app
ng build --configuration production

# Deploy build to server directory
sudo rm -rf $DEPLOY_DIR/*
sudo cp -r dist/calendars-cc/browser/* $DEPLOY_DIR/
sudo chown -R $USER:$USER $DEPLOY_DIR

# Nginx config
sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    root $DEPLOY_DIR;

    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(?:ico|css|js|gif|jpe?g|png|svg|woff2?|ttf|eot)$ {
        expires 1M;
        access_log off;
        add_header Cache-Control "public";
    }
}
EOF

sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/calendars
sudo nginx -t
sudo systemctl reload nginx

echo "Deployment complete and Nginx configured."