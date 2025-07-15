#!/bin/bash

# Variables
REPO_URL="https://github.com/vmikhailov/calendars-cc.git"
REPO_DIR=~/Projects/calendars-cc
DEPLOY_DIR=/var/www/calendars
NGINX_CONF=/etc/nginx/sites-available/calendars

set -e

# Nginx config
cp deployment/nginx.conf $NGINX_CONF

sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/calendars
sudo nginx -t
sudo systemctl reload nginx

echo "Nginx configured."