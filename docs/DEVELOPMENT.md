# Development Guide

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Angular CLI** 17.x
- **Git** for version control

### Development Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vmikhailov/calendars-cc.git
   cd calendars-cc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## Project Architecture

### Frontend Architecture

```
Angular 17 Application
├── Standalone Components
├── TypeScript
├── RxJS for State Management
├── Tailwind CSS for Styling
└── Monaco Editor for Code Editing
```

### Service Layer Architecture

```
Services Layer
├── Business Logic Services
│   ├── AuthService
│   ├── RulesService
│   ├── ProfileService
│   └── NavigationService
└── API Services
    ├── Real API Services (Production)
    └── Mock API Services (Development)
```

### State Management Pattern

We use a reactive state management pattern with RxJS:

```typescript
@Injectable({ providedIn: 'root' })
export class RulesService {
  private rulesSubject = new BehaviorSubject<Rule[]>([]);
  public rules$ = this.rulesSubject.asObservable();

  // Methods update the BehaviorSubject
  updateRules(rules: Rule[]): void {
    this.rulesSubject.next(rules);
  }
}
```

## Code Standards

### TypeScript Guidelines

1. **Use strict typing**
   ```typescript
   // Good
   interface User {
     id: string;
     name: string;
     email: string;
   }

   // Avoid
   const user: any = { ... };
   ```

2. **Interface segregation**
   ```typescript
   // Separate interfaces for different concerns
   export interface IUserApiService {
     getUser(id: string): Observable<User>;
     updateUser(user: User): Observable<User>;
   }
   ```

3. **Use dependency injection**
   ```typescript
   constructor(
     @Inject(RULES_API_SERVICE) private api: IRulesApiService
   ) {}
   ```

### Angular Component Guidelines

1. **Use standalone components**
   ```typescript
   @Component({
     selector: 'app-component',
     standalone: true,
     imports: [CommonModule, RouterModule],
     templateUrl: './component.html'
   })
   ```

2. **OnPush change detection for performance**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

3. **Proper lifecycle management**
   ```typescript
   export class Component implements OnInit, OnDestroy {
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

### CSS/Styling Guidelines

1. **Use Tailwind CSS utilities**
   ```html
   <div class="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
     <h2 class="text-lg font-semibold text-gray-900">Title</h2>
   </div>
   ```

2. **Component-specific styles only when necessary**
   ```scss
   // component.scss
   .custom-component {
     @apply relative overflow-hidden;
     
     &::before {
       content: '';
       // Custom styles that can't be achieved with Tailwind
     }
   }
   ```

## Testing Strategy

### Unit Testing

```typescript
describe('RulesService', () => {
  let service: RulesService;
  let mockApi: jasmine.SpyObj<IRulesApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('IRulesApiService', ['getRules']);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: RULES_API_SERVICE, useValue: spy }
      ]
    });
    
    service = TestBed.inject(RulesService);
    mockApi = TestBed.inject(RULES_API_SERVICE) as jasmine.SpyObj<IRulesApiService>;
  });

  it('should fetch rules', () => {
    const mockRules: Rule[] = [{ id: '1', name: 'Test Rule' }];
    mockApi.getRules.and.returnValue(of(mockRules));

    service.getRules().subscribe(rules => {
      expect(rules).toEqual(mockRules);
    });
  });
});
```

### Component Testing

```typescript
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Development Workflow

### Branch Strategy

```
main (production)
├── develop (integration)
├── feature/feature-name
├── bugfix/bug-description
└── hotfix/critical-fix
```

### Commit Message Convention

```
type(scope): description

feat(rules): add rule duplication functionality
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
style(components): format code according to standards
refactor(services): extract common API logic
test(rules): add unit tests for RulesService
```

### Pull Request Process

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat(component): add new functionality"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/new-feature
   ```

4. **PR Requirements**
   - [ ] Code follows style guidelines
   - [ ] Tests are written and passing
   - [ ] Documentation is updated
   - [ ] No console errors or warnings

## Build and Deployment

### Development Build

```bash
# Development server
npm run dev

# Development build
ng build --configuration development
```

### Production Build

```bash
# Production build
ng build --configuration production

# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/calendars-cc/browser/stats.json
```

### Environment Configuration

```typescript
// environment.development.ts
export const environment = {
  production: false,
  apiRoot: null // Uses mock services
};

// environment.production.ts
export const environment = {
  production: true,
  apiRoot: 'https://api.calendars.cc'
};
```

## Debugging

### Angular DevTools

1. Install Angular DevTools browser extension
2. Open browser developer tools
3. Navigate to Angular tab for component debugging

### Debug Configuration (VS Code)

```json
{
  "name": "Debug Angular",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:4200",
  "webRoot": "${workspaceFolder}",
  "sourceMapPathOverrides": {
    "webpack:/*": "${webRoot}/*"
  }
}
```

### Performance Profiling

```typescript
// Use Angular performance profiler
import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

// Chrome DevTools Performance tab
// Angular DevTools Profiler
```

## Common Development Tasks

### Adding a New Component

1. **Generate component**
   ```bash
   ng generate component components/new-component --standalone
   ```

2. **Update routing** (if needed)
   ```typescript
   // app.routes.ts
   { path: 'new-path', component: NewComponent }
   ```

3. **Add to navigation** (if needed)
   ```typescript
   // menu-item.model.ts
   {
     id: 'new-item',
     label: 'New Item',
     icon: 'icon-name',
     description: 'Description'
   }
   ```

### Adding a New Service

1. **Generate service**
   ```bash
   ng generate service services/new-service
   ```

2. **Define interface**
   ```typescript
   export interface INewService {
     getData(): Observable<Data[]>;
   }
   ```

3. **Implement service**
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class NewService implements INewService {
     // Implementation
   }
   ```

### Adding API Integration

1. **Define API interface**
   ```typescript
   // api-services/new/interface.ts
   export interface INewApiService {
     getData(): Observable<Data[]>;
   }
   ```

2. **Implement real service**
   ```typescript
   // api-services/new/service.ts
   @Injectable({ providedIn: 'root' })
   export class NewApiService implements INewApiService {
     // HTTP implementation
   }
   ```

3. **Implement mock service**
   ```typescript
   // api-services/new/mock.ts
   @Injectable({ providedIn: 'root' })
   export class NewApiMockService implements INewApiService {
     // Mock implementation
   }
   ```

4. **Add to providers**
   ```typescript
   // api-services/api-providers.ts
   const realProviders: Provider[] = [
     { provide: NEW_API_SERVICE, useClass: NewApiService }
   ];
   ```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript compilation errors**
   ```bash
   # Check TypeScript version compatibility
   ng version
   npm list typescript
   ```

3. **Memory issues during build**
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=8192"
   ng build
   ```

### Development Tools

- **Angular CLI**: Project scaffolding and build tools
- **VS Code Extensions**:
  - Angular Language Service
  - Angular Snippets
  - TypeScript Importer
  - Tailwind CSS IntelliSense
- **Browser Extensions**:
  - Angular DevTools
  - Redux DevTools

## Performance Optimization

### Bundle Size Optimization

1. **Lazy loading**
   ```typescript
   const routes: Routes = [
     {
       path: 'feature',
       loadComponent: () => import('./feature/feature.component')
     }
   ];
   ```

2. **Tree shaking**
   ```typescript
   // Import only what you need
   import { map, filter } from 'rxjs/operators';
   // Instead of
   import * as operators from 'rxjs/operators';
   ```

3. **OnPush change detection**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

### Runtime Performance

1. **TrackBy functions**
   ```typescript
   trackByFn(index: number, item: any): any {
     return item.id;
   }
   ```

2. **Async pipes**
   ```html
   <div *ngFor="let item of items$ | async">
     {{ item.name }}
   </div>
   ```

3. **Virtual scrolling**
   ```html
   <cdk-virtual-scroll-viewport itemSize="50">
     <div *cdkVirtualFor="let item of items">{{item}}</div>
   </cdk-virtual-scroll-viewport>
   ```
