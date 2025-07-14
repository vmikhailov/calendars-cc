#!/bin/bash

set -e

# Update and upgrade system packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js (LTS), npm, and git
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Install nginx
sudo apt-get install -y nginx

# Install Angular CLI globally
sudo npm install -g @angular/cli

# Set up UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create deployment directory for calendars app
sudo mkdir -p /var/www/calendars
sudo chown $USER:$USER /var/www/calendars

echo "Server is ready for deployment of the calendars app."