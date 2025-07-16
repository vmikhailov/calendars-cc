# Calendars CC - Calendar Synchronization Platform

A sophisticated Angular-based web application for managing calendar synchronization with advanced rule-based filtering and transformation capabilities.

## 🌟 Overview

Calendars CC is a modern calendar synchronization platform that allows users to create custom rules for filtering, transforming, and synchronizing events across multiple calendar systems. Built with Angular 17 and TypeScript, it features a clean, responsive interface powered by Tailwind CSS.

## ✨ Key Features

### 🗓️ Calendar Management
- **Multi-Calendar Support**: Connect and manage multiple calendar sources
- **Event Synchronization**: Real-time synchronization across calendar platforms
- **Calendar Sources Management**: Configure and control various calendar integrations

### ⚙️ Advanced Rule Engine
- **Custom Rules**: Create JavaScript-based rules for event processing
- **Rule Types**:
  - **Filter Rules**: Include/exclude events based on custom criteria
  - **Transform Rules**: Modify event properties (title, description, etc.)
  - **Condition Rules**: Apply conditional logic to event processing
- **Code Editor**: Monaco Editor integration for rule development
- **Rule Status Management**: Active, paused, draft, and disabled states

### 📊 Analytics & Monitoring
- **Dashboard**: Comprehensive overview of sync activities
- **Statistics**: Real-time metrics on sync performance
- **Sync Logs**: Detailed logging of synchronization events
- **Success Rate Tracking**: Monitor sync reliability

### 👤 User Management
- **Authentication**: Secure login and signup system
- **User Profiles**: Comprehensive user information management
- **Settings**: Customizable application preferences

### 💳 Billing & Subscriptions
- **Flexible Plans**: Free, Pro, and Enterprise tiers
- **Payment Management**: Support for multiple payment methods
- **Invoice History**: Complete billing transaction records

## 🏗️ Technical Architecture

### Frontend Framework
- **Angular 17**: Latest Angular with standalone components
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming patterns
- **Tailwind CSS**: Utility-first styling framework

### UI Components
- **Lucide Angular**: Modern icon system
- **Monaco Editor**: Advanced code editing capabilities
- **Responsive Design**: Mobile-first approach

### State Management
- **Services**: Angular services with BehaviorSubjects
- **Reactive Patterns**: Observable-based data flow
- **Dependency Injection**: Clean architecture with interfaces

### API Layer
- **Service Abstraction**: Interface-based API services
- **Mock Services**: Development-friendly mock implementations
- **HTTP Client**: Angular HttpClient for real API calls
- **Environment-based Configuration**: Flexible API endpoint management

## 📁 Project Structure

```
src/
├── app/
│   ├── components/           # UI Components
│   │   ├── auth/            # Authentication components
│   │   ├── billing/         # Billing management
│   │   ├── calendar/        # Calendar views
│   │   ├── dashboard/       # Main dashboard
│   │   ├── navigation/      # Navigation components
│   │   ├── profile/         # User profile
│   │   ├── rules/           # Rule management
│   │   ├── settings/        # Application settings
│   │   └── stats-cards/     # Statistics display
│   ├── services/            # Business logic services
│   │   ├── auth.service.ts
│   │   ├── navigation.service.ts
│   │   ├── profile.service.ts
│   │   └── rules.service.ts
│   ├── api-services/        # API abstraction layer
│   │   ├── calendar/        # Calendar API services
│   │   ├── rules/           # Rules API services
│   │   ├── settings/        # Settings API services
│   │   └── stats/           # Statistics API services
│   ├── models/              # TypeScript interfaces
│   │   ├── auth.model.ts
│   │   ├── rule.model.ts
│   │   └── user.model.ts
│   ├── guards/              # Route guards
│   │   └── auth.guard.ts
│   └── framework/           # Framework utilities
├── environments/            # Environment configurations
└── deployment/             # Deployment scripts and configs
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Angular CLI 17+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vmikhailov/calendars-cc.git
   cd calendars-cc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development server**
   ```bash
   npm run dev
   # or
   ng serve --configuration development
   ```

4. **Access the application**
   - Open your browser to `http://localhost:4200`

### Available Scripts

- `npm start` - Start development server
- `npm run dev` - Start development server with development configuration
- `npm run local` - Start server with local configuration
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm run test` - Run unit tests

## 🔧 Configuration

### Environment Files
- `environment.development.ts` - Development settings
- `environment.local.ts` - Local development settings
- `environment.production.ts` - Production settings

### API Configuration
The application uses a flexible API configuration system that supports both mock and real API endpoints:

```typescript
// Mock APIs (development)
apiRoot: null

// Real APIs (production)
apiRoot: "https://api.calendars.cc"
```

## 🎯 Core Features Deep Dive

### Rule Engine
The heart of Calendars CC is its powerful rule engine that allows users to create custom JavaScript code for event processing:

**Example Filter Rule:**
```javascript
// Work Hours Filter
function filterWorkHours(event) {
  const startHour = new Date(event.start).getHours();
  return startHour >= 9 && startHour <= 18;
}
return filterWorkHours(event);
```

**Example Transform Rule:**
```javascript
// Add Work Prefix
function transformTitle(event) {
  if (!event.title.startsWith('[WORK]')) {
    event.title = '[WORK] ' + event.title;
  }
  return event;
}
return transformTitle(event);
```

### Dashboard Analytics
Real-time statistics provide insights into:
- Active rule count
- Daily sync events
- Success rate percentage
- Issues requiring attention

### User Authentication
Secure authentication system with:
- Email/password login
- User registration
- Protected routes
- Session management

## 🚀 Deployment

### Production Deployment
The application includes automated deployment scripts:

1. **Build for production**
   ```bash
   ng build --configuration production
   ```

2. **Deploy using deployment script**
   ```bash
   ./deployment/deploy.sh
   ```

### Infrastructure
- **Web Server**: Nginx with SSL/TLS
- **Domain**: calendars.cc with HTTPS redirect
- **Static Hosting**: Optimized for SPA deployment

### Nginx Configuration
```nginx
server {
    listen 443 ssl;
    server_name calendars.cc;
    root /var/www/calendars;
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🛠️ Development Guidelines

### Code Architecture
- **Standalone Components**: Modern Angular component architecture
- **Interface Segregation**: Clean API service interfaces
- **Reactive Programming**: RxJS observables throughout
- **Type Safety**: Comprehensive TypeScript coverage

### Service Layer
```typescript
@Injectable({ providedIn: 'root' })
export class RulesService {
  private rulesSubject = new BehaviorSubject<Rule[]>([]);
  public rules$ = this.rulesSubject.asObservable();
  
  constructor(@Inject(RULES_API_SERVICE) private api: IRulesApiService) {}
}
```

### API Service Pattern
```typescript
export interface IRulesApiService {
  getRules(): Observable<Rule[]>;
  saveRule(rule: Rule): Observable<Rule>;
  deleteRule(ruleId: string): Observable<boolean>;
}
```

## 📱 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Adaptive layouts for all screen sizes

### Modern UI Components
- Clean, professional interface
- Lucide icons for consistency
- Interactive dashboards
- Real-time updates

### Code Editing
- Monaco Editor integration
- Syntax highlighting for JavaScript
- Auto-completion and validation
- Full-screen editing mode

## 🔒 Security

### Authentication & Authorization
- JWT-based authentication
- Route guards for protected pages
- Role-based access control
- Secure session management

### Data Protection
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure API communication

## 📈 Future Roadmap

### Planned Features
- **Calendar Provider Integration**: Google Calendar, Outlook, Apple Calendar
- **Advanced Rule Templates**: Pre-built rule library
- **Team Collaboration**: Multi-user workspace support
- **API Webhooks**: Real-time event notifications
- **Mobile Applications**: iOS and Android apps
- **Advanced Analytics**: Detailed reporting and insights

### Technical Improvements
- **Performance Optimization**: Lazy loading and caching
- **Test Coverage**: Comprehensive unit and e2e tests
- **Documentation**: API documentation and user guides
- **Internationalization**: Multi-language support

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and standards
- Pull request process
- Issue reporting
- Development setup

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@calendars.cc
- 🐛 Issues: GitHub Issues
- 📖 Documentation: Project Wiki

---

**Calendars CC** - Streamlining calendar synchronization with intelligent rule-based automation.
