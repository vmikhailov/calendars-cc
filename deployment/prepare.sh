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

# Set up iptables firewall
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT      # Allow SSH
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT      # Allow HTTP
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT     # Allow HTTPS
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -j DROP                          # Drop all other inbound traffic
# Save rules (Debian/Ubuntu)
sudo mkdir -p /etc/iptables
sudo sh -c "iptables-save > /etc/iptables/rules.v4"

# Create deployment directory for calendars app
sudo mkdir -p /var/www/calendars
sudo chown $USER:$USER /var/www/calendars

echo "Server is ready for deployment of the calendars app."