# Deployment Guide

## Overview

This guide covers deploying Calendars CC to production environments, including server setup, CI/CD pipelines, and monitoring.

## Production Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Proxy     │    │   Web Server    │    │   API Server    │
│   (Cloudflare)  │────│     (Nginx)     │────│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │    Database     │
                       │  (PostgreSQL)   │
                       └─────────────────┘
```

## Server Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 50GB SSD
- **OS**: Ubuntu 20.04 LTS or later

### Recommended Requirements
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 100GB SSD
- **OS**: Ubuntu 22.04 LTS

### Software Requirements
- **Node.js**: 18.x or later
- **npm**: 9.x or later
- **Nginx**: 1.18 or later
- **SSL Certificate**: Let's Encrypt or commercial

## Server Setup

### 1. Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git nginx ufw

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Install Node.js

```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install Angular CLI

```bash
sudo npm install -g @angular/cli@17
ng version
```

### 4. Create Application User

```bash
# Create dedicated user for the application
sudo adduser calendars
sudo usermod -aG sudo calendars

# Switch to application user
sudo su - calendars
```

## Application Deployment

### 1. Clone Repository

```bash
# Clone from GitHub
git clone https://github.com/vmikhailov/calendars-cc.git
cd calendars-cc

# Create production branch
git checkout -b prod
```

### 2. Install Dependencies

```bash
# Install npm dependencies
npm ci --production

# Install Angular CLI locally if needed
npm install @angular/cli@17
```

### 3. Build Application

```bash
# Build for production
ng build --configuration production

# Verify build output
ls -la dist/calendars-cc/browser/
```

### 4. Deploy Files

```bash
# Create deployment directory
sudo mkdir -p /var/www/calendars
sudo chown calendars:calendars /var/www/calendars

# Copy build files
cp -r dist/calendars-cc/browser/* /var/www/calendars/

# Set correct permissions
sudo chown -R www-data:www-data /var/www/calendars
sudo chmod -R 755 /var/www/calendars
```

## Nginx Configuration

### 1. Create Nginx Site Configuration

```bash
sudo nano /etc/nginx/sites-available/calendars
```

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name calendars.cc www.calendars.cc;
    return 301 https://calendars.cc$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name calendars.cc;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/calendars.cc/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/calendars.cc/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Application root
    root /var/www/calendars;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Static assets with long cache
    location ~* \.(?:ico|css|js|gif|jpe?g|png|svg|woff2?|ttf|eot)$ {
        expires 1M;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    # Angular routing - all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if using separate API server)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 2. Enable Site and Test Configuration

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/calendars /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## SSL Certificate Setup

### 1. Install Certbot

```bash
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 2. Obtain SSL Certificate

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Obtain certificate
sudo certbot certonly --standalone -d calendars.cc -d www.calendars.cc

# Start Nginx
sudo systemctl start nginx
```

### 3. Setup Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Setup automatic renewal (already configured by snap)
sudo systemctl list-timers snap.certbot.renew
```

## Automated Deployment Script

Create an automated deployment script for easy updates:

```bash
#!/bin/bash
# File: deployment/deploy.sh

# Configuration
REPO_URL="https://github.com/vmikhailov/calendars-cc.git"
REPO_DIR=~/Projects/calendars-cc
DEPLOY_DIR=/var/www/calendars
NGINX_CONF=/etc/nginx/sites-available/calendars

set -e

echo "Starting deployment..."

# Create backup of current deployment
if [ -d "$DEPLOY_DIR" ]; then
    sudo cp -r $DEPLOY_DIR ${DEPLOY_DIR}_backup_$(date +%Y%m%d_%H%M%S)
fi

# Clone or update repository
if [ ! -d "$REPO_DIR/.git" ]; then
    git clone $REPO_URL $REPO_DIR
fi

cd $REPO_DIR
git pull origin prod

# Install dependencies
npm ci

# Build application
ng build --configuration production

# Deploy to web directory
sudo rm -rf $DEPLOY_DIR/*
sudo mkdir -p $DEPLOY_DIR
sudo cp -r dist/calendars-cc/browser/* $DEPLOY_DIR/
sudo chown -R www-data:www-data $DEPLOY_DIR
sudo chmod -R 755 $DEPLOY_DIR

# Update Nginx configuration if changed
if [ -f "deployment/nginx.conf" ]; then
    sudo cp deployment/nginx.conf $NGINX_CONF
    sudo nginx -t
    sudo systemctl reload nginx
fi

echo "Deployment completed successfully!"
```

Make the script executable:

```bash
chmod +x deployment/deploy.sh
```

## Environment Configuration

### Production Environment Variables

Create a production environment file:

```typescript
// src/environments/environment.production.ts
export const environment = {
  production: true,
  apiRoot: 'https://api.calendars.cc',
  version: '1.0.0',
  analytics: {
    googleAnalyticsId: 'GA_MEASUREMENT_ID'
  },
  sentry: {
    dsn: 'SENTRY_DSN_URL'
  }
};
```

### Build Configuration

Update `angular.json` for production optimizations:

```json
{
  "projects": {
    "calendars-cc": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ],
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [prod]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test -- --watch=false --browsers=ChromeHeadless
    
    - name: Build production
      run: npm run build -- --configuration production
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /home/calendars/calendars-cc
          git pull origin prod
          npm ci
          ng build --configuration production
          sudo cp -r dist/calendars-cc/browser/* /var/www/calendars/
          sudo systemctl reload nginx
```

### Environment Secrets

Configure these secrets in GitHub repository settings:
- `HOST`: Server IP address
- `USERNAME`: SSH username
- `SSH_KEY`: Private SSH key for deployment

## Monitoring and Logging

### 1. Application Monitoring

Install monitoring tools:

```bash
# Install PM2 for process management (if using Node.js API)
sudo npm install -g pm2

# Setup system monitoring
sudo apt install htop iotop nethogs
```

### 2. Nginx Log Analysis

Configure log rotation:

```bash
# Edit logrotate configuration
sudo nano /etc/logrotate.d/nginx
```

```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
        fi \
    endscript
    postrotate
        invoke-rc.d nginx rotate >/dev/null 2>&1
    endscript
}
```

### 3. Error Tracking

Configure error monitoring with Sentry:

```typescript
// main.ts
import * as Sentry from '@sentry/angular';

if (environment.production) {
  Sentry.init({
    dsn: environment.sentry.dsn,
    environment: 'production',
    tracesSampleRate: 0.1
  });
}
```

## Security Hardening

### 1. Server Security

```bash
# Update system packages regularly
sudo apt update && sudo apt upgrade -y

# Configure automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades

# Setup fail2ban for SSH protection
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 2. Application Security

- Use HTTPS only
- Implement CSP headers
- Regular dependency updates
- Security scanning with npm audit

### 3. Database Security (if applicable)

```bash
# Secure PostgreSQL installation
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'strong_password';"

# Restrict database access
sudo nano /etc/postgresql/*/main/postgresql.conf
# Set: listen_addresses = 'localhost'
```

## Backup Strategy

### 1. Application Backup

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/backup/calendars

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/calendars

# Backup configuration
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /etc/nginx/sites-available/calendars

# Remove old backups (keep 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### 2. Automated Backups

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /home/calendars/backup.sh
```

## Performance Optimization

### 1. Nginx Optimizations

```nginx
# Add to nginx.conf
worker_processes auto;
worker_connections 1024;

# Enable HTTP/2
listen 443 ssl http2;

# Optimize SSL
ssl_session_cache shared:SSL:50m;
ssl_session_timeout 1d;
ssl_session_tickets off;

# Enable caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Angular Build Optimizations

```bash
# Build with additional optimizations
ng build --configuration production --build-optimizer --vendor-chunk --common-chunk
```

### 3. CDN Integration

Configure CDN for static assets:

```typescript
// angular.json
"deployUrl": "https://cdn.calendars.cc/"
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Node.js version
   node --version
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Nginx Configuration Errors**
   ```bash
   # Test configuration
   sudo nginx -t
   # Check error logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   # Renew if needed
   sudo certbot renew
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R www-data:www-data /var/www/calendars
   sudo chmod -R 755 /var/www/calendars
   ```

## Rollback Procedures

### 1. Quick Rollback

```bash
# Restore from backup
sudo rm -rf /var/www/calendars/*
sudo tar -xzf /backup/calendars/app_YYYYMMDD_HHMMSS.tar.gz -C /
sudo systemctl reload nginx
```

### 2. Git-based Rollback

```bash
# Rollback to previous commit
cd ~/Projects/calendars-cc
git reset --hard HEAD~1
ng build --configuration production
sudo cp -r dist/calendars-cc/browser/* /var/www/calendars/
```

## Health Checks

### Application Health Check

```bash
#!/bin/bash
# health-check.sh

URL="https://calendars.cc/health"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $HTTP_CODE -eq 200 ]; then
    echo "Application is healthy"
    exit 0
else
    echo "Application health check failed: HTTP $HTTP_CODE"
    exit 1
fi
```

### Monitoring Script

```bash
#!/bin/bash
# monitor.sh

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Warning: Disk usage is ${DISK_USAGE}%"
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.1f"), $3/$2 * 100.0}')
echo "Memory usage: ${MEMORY_USAGE}%"

# Check Nginx status
if ! systemctl is-active --quiet nginx; then
    echo "Warning: Nginx is not running"
fi
```

This deployment guide provides a comprehensive approach to deploying Calendars CC in a production environment with proper security, monitoring, and maintenance procedures.
