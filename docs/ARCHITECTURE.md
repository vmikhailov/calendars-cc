# Architecture Documentation

## System Overview

Calendars CC is a modern Angular-based web application designed for calendar synchronization with advanced rule-based processing. The architecture emphasizes modularity, testability, and maintainability through clean separation of concerns and dependency injection.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Angular Components (Standalone) | Templates | Styles       │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Services | State Management | Navigation    │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                    API Abstraction Layer                    │
├─────────────────────────────────────────────────────────────┤
│  API Interfaces | Mock Services | HTTP Services             │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                    External APIs                            │
├─────────────────────────────────────────────────────────────┤
│  Calendar APIs | Authentication | Third-party Integrations  │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Architecture

The application uses Angular 17's standalone component architecture for better tree-shaking and modularity:

```typescript
@Component({
  selector: 'app-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class StandaloneComponent {
  // Component logic
}
```

### State Management Pattern

We implement a reactive state management pattern using RxJS BehaviorSubjects:

```typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private dataSubject = new BehaviorSubject<Data[]>([]);
  public data$ = this.dataSubject.asObservable();

  updateData(data: Data[]): void {
    this.dataSubject.next(data);
  }
}
```

### Service Layer Architecture

```
Services
├── Business Logic Services
│   ├── AuthService (Authentication & Authorization)
│   ├── RulesService (Rule Management)
│   ├── ProfileService (User Profile & Settings)
│   └── NavigationService (Navigation State)
└── Infrastructure Services
    ├── API Services (HTTP Communication)
    ├── Guard Services (Route Protection)
    └── Utility Services (Helper Functions)
```

## API Layer Design

### Interface Segregation

Each API domain has its own interface to ensure loose coupling:

```typescript
// Rules API Interface
export interface IRulesApiService {
  getRules(): Observable<Rule[]>;
  saveRule(rule: Rule): Observable<Rule>;
  deleteRule(ruleId: string): Observable<boolean>;
}

// Stats API Interface  
export interface IStatsApiService {
  getStats(): Observable<Stat[]>;
}
```

### Provider Pattern

The application uses Angular's dependency injection with provider tokens:

```typescript
export const RULES_API_SERVICE = new InjectionToken<IRulesApiService>('RulesApiService');

// Injection
constructor(@Inject(RULES_API_SERVICE) private api: IRulesApiService) {}
```

### Mock vs Real Services

Environment-based service selection enables development with mock data:

```typescript
const realProviders: Provider[] = [
  { provide: RULES_API_SERVICE, useClass: RulesApiService }
];

const mockProviders: Provider[] = [
  { provide: RULES_API_SERVICE, useClass: RulesApiMockService }
];

export const apiProviders = environment.apiRoot ? realProviders : mockProviders;
```

## Data Flow Architecture

### Reactive Data Flow

```
User Action → Component → Service → API → Service → Component → UI Update
     ↑                                                           ↓
     └─────────────── Observable Stream ──────────────────────────┘
```

### Example Data Flow

1. **User clicks "Save Rule"**
2. **Component calls service method**
   ```typescript
   onSaveRule(): void {
     this.rulesService.updateRule(this.rule);
   }
   ```

3. **Service updates state and calls API**
   ```typescript
   updateRule(rule: Rule): void {
     this.api.saveRule(rule).subscribe(updatedRule => {
       const rules = this.rulesSubject.value;
       const index = rules.findIndex(r => r.id === rule.id);
       rules[index] = updatedRule;
       this.rulesSubject.next([...rules]);
     });
   }
   ```

4. **Component reacts to state changes**
   ```typescript
   ngOnInit(): void {
     this.rulesService.rules$
       .pipe(takeUntil(this.destroy$))
       .subscribe(rules => this.rules = rules);
   }
   ```

## Component Architecture

### Page Components

High-level page components that represent application routes:

```
Page Components
├── DashboardComponent (/)
├── CalendarsComponent (/calendars)
├── RulesComponent (/rules)
├── ProfileComponent (/profile)
├── BillingComponent (/billing)
└── SettingsComponent (/settings)
```

### Feature Components

Reusable components for specific features:

```
Feature Components
├── NavigationComponent (Main navigation)
├── StatsCardsComponent (Dashboard statistics)
├── RuleEditorComponent (Rule code editing)
├── CalendarViewComponent (Calendar display)
└── SyncLogsComponent (Sync activity logs)
```

### UI Components

Basic UI building blocks:

```
UI Components
├── ButtonComponent
├── ModalComponent
├── FormFieldComponent
├── LoadingSpinnerComponent
└── ToastComponent
```

## Security Architecture

### Authentication Flow

```
User Login → AuthService → JWT Token → HTTP Interceptor → API Requests
     ↓
Token Storage → LocalStorage/SessionStorage → Auto-refresh
```

### Route Protection

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}
```

### Security Headers

Implemented via HTTP interceptors and server configuration:

```typescript
@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const secureReq = req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    });
    return next.handle(secureReq);
  }
}
```

## Performance Architecture

### Bundle Optimization

```
Application Bundle
├── Main Bundle (Core application code)
├── Vendor Bundle (Third-party libraries)
├── Polyfills Bundle (Browser compatibility)
└── Lazy Loaded Modules (Feature-specific code)
```

### Change Detection Strategy

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  // Only runs change detection when:
  // 1. Input properties change
  // 2. Event occurs
  // 3. Observable emits (with async pipe)
}
```

### Memory Management

```typescript
export class Component implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Handle data
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Testing Architecture

### Testing Strategy

```
Testing Pyramid
├── Unit Tests (70%)
│   ├── Service Logic
│   ├── Component Logic
│   └── Utility Functions
├── Integration Tests (20%)
│   ├── Component-Service Integration
│   ├── API Service Tests
│   └── Router Tests
└── E2E Tests (10%)
    ├── Critical User Flows
    ├── Authentication Flows
    └── Business Process Tests
```

### Test Structure

```typescript
describe('RulesService', () => {
  let service: RulesService;
  let httpMock: HttpTestingController;
  let mockApiService: jasmine.SpyObj<IRulesApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('IRulesApiService', ['getRules', 'saveRule']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: RULES_API_SERVICE, useValue: spy }
      ]
    });

    service = TestBed.inject(RulesService);
    mockApiService = TestBed.inject(RULES_API_SERVICE) as jasmine.SpyObj<IRulesApiService>;
  });

  it('should fetch rules', fakeAsync(() => {
    const mockRules: Rule[] = [{ id: '1', name: 'Test Rule' }];
    mockApiService.getRules.and.returnValue(of(mockRules));

    let result: Rule[];
    service.getRules().subscribe(rules => result = rules);
    tick();

    expect(result).toEqual(mockRules);
    expect(mockApiService.getRules).toHaveBeenCalled();
  }));
});
```

## Deployment Architecture

### Build Process

```
Source Code → TypeScript Compilation → Angular Build → Bundle Optimization → Static Assets
     ↓
Environment Configuration → Production Build → Asset Optimization → Deployment Package
```

### Deployment Pipeline

```
GitHub Repository → CI/CD Pipeline → Testing → Build → Deploy to Server
     ↓                    ↓              ↓        ↓         ↓
Branch Protection → Automated Tests → Quality Gates → Nginx → Live Application
```

### Infrastructure

```
Internet → CDN/Proxy → Load Balancer → Web Server → Application Bundle
    ↓         ↓            ↓              ↓              ↓
SSL/TLS → Caching → Traffic Distribution → Static Files → SPA Routes
```

## Scalability Considerations

### Frontend Scalability

1. **Lazy Loading**
   ```typescript
   const routes: Routes = [
     {
       path: 'feature',
       loadComponent: () => import('./feature/feature.component')
     }
   ];
   ```

2. **Virtual Scrolling**
   ```html
   <cdk-virtual-scroll-viewport itemSize="50">
     <div *cdkVirtualFor="let item of items">{{item}}</div>
   </cdk-virtual-scroll-viewport>
   ```

3. **OnPush Change Detection**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

### State Management Scalability

For larger applications, consider:

1. **NgRx for complex state**
2. **Akita for reactive state**
3. **RxJS operators for transformation**
4. **Memoization for expensive operations**

## Monitoring and Observability

### Error Tracking

```typescript
// Global error handler
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error:', error);
    // Send to monitoring service (Sentry, LogRocket, etc.)
  }
}
```

### Performance Monitoring

```typescript
// Performance tracking
@Injectable()
export class PerformanceService {
  trackPageLoad(route: string): void {
    performance.mark('page-start');
    // Track load time
  }

  trackUserAction(action: string): void {
    // Track user interactions
  }
}
```

### Analytics Integration

```typescript
// Analytics service
@Injectable()
export class AnalyticsService {
  trackEvent(event: string, properties?: any): void {
    if (environment.production) {
      // Send to analytics service
    }
  }
}
```

## Future Architecture Considerations

### Micro-Frontend Architecture

For scaling to larger teams:

```
Main Shell Application
├── Rules Module (Team A)
├── Calendar Module (Team B)
├── Analytics Module (Team C)
└── Shared Components (Platform Team)
```

### Progressive Web App (PWA)

Adding PWA capabilities:

1. **Service Workers** for offline functionality
2. **App Manifest** for native-like experience
3. **Push Notifications** for real-time updates
4. **Background Sync** for offline operations

### WebAssembly Integration

For performance-critical operations:

1. **Rule Engine** in WebAssembly for faster execution
2. **Data Processing** for large datasets
3. **Cryptographic Operations** for security

This architecture provides a solid foundation for the current application while allowing for future growth and enhancement.
