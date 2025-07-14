#!/bin/bash

set -e

# Variables
REPO_URL="https://github.com/vmikhailov/calendars-cc.git"
REPO_DIR=~/Projects/calendars-cc
DEPLOY_DIR=/var/www/calendars

# Clone or update repo
if [ ! -d "$REPO_DIR/.git" ]; then
  git clone $REPO_URL $REPO_DIR
fi

cd $REPO_DIR
git pull origin main

# Install dependencies
npm ci

# Build Angular app
ng build --configuration production

# Deploy build to server directory
sudo rm -rf $DEPLOY_DIR/*
sudo cp -r dist/calendars-cc/* $DEPLOY_DIR/
sudo chown -R $USER:$USER $DEPLOY_DIR

echo "Deployment complete."