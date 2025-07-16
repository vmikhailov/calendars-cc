# API Documentation

## Overview

Calendars CC provides a RESTful API for managing calendar synchronization rules, events, and user settings. The API follows REST conventions and returns JSON responses.

## Base URL

- **Production**: `https://api.calendars.cc`
- **Development**: Mock services (no external API calls)

## Authentication

All API endpoints (except public ones) require authentication using JWT tokens:

```http
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Rules API

#### Get All Rules
```http
GET /api/rules
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Work Hours Filter",
    "description": "Only sync events during work hours (9 AM - 6 PM)",
    "status": "active",
    "lastModified": "2025-01-15 14:30",
    "type": "filter",
    "code": "// JavaScript code for the rule"
  }
]
```

#### Save Rule
```http
POST /api/rules
```

**Request Body:**
```json
{
  "name": "Rule Name",
  "description": "Rule description",
  "type": "filter|transform|condition",
  "code": "// JavaScript code"
}
```

#### Get Rule Code
```http
GET /api/rules/:id/code
```

#### Update Rule Code
```http
PUT /api/rules/:id/code
```

**Request Body:**
```json
{
  "code": "// Updated JavaScript code"
}
```

#### Delete Rule
```http
DELETE /api/rules/:id
```

#### Rule Status Management
```http
POST /api/rules/:id/enable
POST /api/rules/:id/disable
POST /api/rules/:id/pause
```

### Stats API

#### Get Statistics
```http
GET /api/stats
```

**Response:**
```json
[
  {
    "title": "Active Rules",
    "value": "20",
    "icon": "refresh-cw",
    "color": "bg-blue-500",
    "bgColor": "bg-blue-50",
    "textColor": "text-blue-700"
  }
]
```

### Calendar Events API

#### Get Events
```http
GET /api/events
```

**Response:**
```json
[
  {
    "id": "1",
    "title": "Team Meeting",
    "time": "09:00 - 10:30",
    "location": "Conference Room A",
    "attendees": 5,
    "calendar": "Work",
    "color": "bg-blue-500"
  }
]
```

### Settings API

#### Get User Settings
```http
GET /api/settings
```

**Response:**
```json
{
  "notifications": {
    "email": true,
    "push": true,
    "syncErrors": true,
    "weeklyReport": false
  },
  "sync": {
    "frequency": "15min",
    "autoRetry": true,
    "maxRetries": 3
  },
  "privacy": {
    "shareUsageData": false,
    "allowAnalytics": true
  },
  "appearance": {
    "theme": "light",
    "compactMode": false
  }
}
```

#### Update Settings
```http
PUT /api/settings
```

**Request Body:** Same as GET response format

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Rule name is required",
    "details": {}
  }
}
```

## Data Models

### Rule Model
```typescript
interface Rule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft' | 'disabled';
  lastModified: string;
  type: 'filter' | 'transform' | 'condition';
  code: string;
}
```

### Event Model
```typescript
interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  attendees?: number;
  calendar: string;
  color: string;
}
```

### User Settings Model
```typescript
interface AppSettings {
  notifications: {
    email: boolean;
    push: boolean;
    syncErrors: boolean;
    weeklyReport: boolean;
  };
  sync: {
    frequency: '5min' | '15min' | '30min' | '1hour';
    autoRetry: boolean;
    maxRetries: number;
  };
  privacy: {
    shareUsageData: boolean;
    allowAnalytics: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
  };
}
```

## Rate Limiting

API requests are rate limited:
- **Free Plan**: 100 requests/hour
- **Pro Plan**: 1000 requests/hour  
- **Enterprise Plan**: 10000 requests/hour

## SDKs and Libraries

### JavaScript/TypeScript
```typescript
import { CalendarsApi } from '@calendars-cc/api';

const api = new CalendarsApi({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.calendars.cc'
});

// Get rules
const rules = await api.rules.getAll();

// Create rule
const newRule = await api.rules.create({
  name: 'My Rule',
  type: 'filter',
  code: '// rule code'
});
```

## Webhooks

Subscribe to real-time events:

### Available Events
- `rule.created`
- `rule.updated`
- `rule.deleted`
- `sync.completed`
- `sync.failed`

### Webhook Configuration
```http
POST /api/webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["rule.created", "sync.completed"],
  "secret": "webhook-secret"
}
```

### Webhook Payload
```json
{
  "event": "rule.created",
  "timestamp": "2025-01-15T14:30:00Z",
  "data": {
    "rule": {
      "id": "123",
      "name": "New Rule"
    }
  }
}
```
