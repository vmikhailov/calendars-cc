#!/bin/bash

# Variables
REPO_URL="https://github.com/vmikhailov/calendars-cc.git"
REPO_DIR=~/Projects/calendars-cc
DEPLOY_DIR=/var/www/calendars
NGINX_CONF=/etc/nginx/sites-available/calendars

set -e

sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/calendars
sudo nginx -t
sudo systemctl reload nginx

# Generate version info (in case config is used for local/test deploys)
node scripts/generate-version-info.js

echo "Version info generated."

echo "Nginx configured."