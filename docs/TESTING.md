# Testing Guide

## Overview

This guide covers testing strategies, best practices, and implementation details for Calendars CC. We follow a comprehensive testing approach that includes unit tests, integration tests, and end-to-end tests.

## Testing Philosophy

### Testing Pyramid

```
           E2E Tests (10%)
         ─────────────────
       Integration Tests (20%)
     ─────────────────────────
    Unit Tests (70%)
  ─────────────────────────────
```

- **Unit Tests (70%)**: Fast, isolated tests for individual components and services
- **Integration Tests (20%)**: Tests for component-service interactions and API integration
- **E2E Tests (10%)**: End-to-end user journey tests for critical flows

### Testing Principles

1. **Fast Feedback**: Tests should run quickly to enable rapid development
2. **Reliable**: Tests should be deterministic and not flaky
3. **Maintainable**: Tests should be easy to understand and modify
4. **Comprehensive**: Critical paths must be fully tested

## Unit Testing

### Testing Framework

We use **Jasmine** and **Karma** for unit testing:

```json
{
  "scripts": {
    "test": "ng test",
    "test:watch": "ng test --watch",
    "test:coverage": "ng test --code-coverage",
    "test:headless": "ng test --watch=false --browsers=ChromeHeadless"
  }
}
```

### Service Testing

#### Basic Service Test Structure

```typescript
describe('RulesService', () => {
  let service: RulesService;
  let mockApiService: jasmine.SpyObj<IRulesApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('IRulesApiService', [
      'getRules', 
      'saveRule', 
      'deleteRule'
    ]);

    TestBed.configureTestingModule({
      providers: [
        RulesService,
        { provide: RULES_API_SERVICE, useValue: spy }
      ]
    });

    service = TestBed.inject(RulesService);
    mockApiService = TestBed.inject(RULES_API_SERVICE) as jasmine.SpyObj<IRulesApiService>;
  });

  afterEach(() => {
    // Cleanup if needed
  });
});
```

#### Testing Observable Patterns

```typescript
describe('RulesService Observable Tests', () => {
  it('should emit rules when getRules is called', fakeAsync(() => {
    const mockRules: Rule[] = [
      { id: '1', name: 'Test Rule', status: 'active', type: 'filter' }
    ];
    mockApiService.getRules.and.returnValue(of(mockRules));

    let emittedRules: Rule[];
    service.rules$.subscribe(rules => emittedRules = rules);

    service.loadRules();
    tick();

    expect(emittedRules).toEqual(mockRules);
    expect(mockApiService.getRules).toHaveBeenCalled();
  }));

  it('should handle errors gracefully', fakeAsync(() => {
    const error = new Error('API Error');
    mockApiService.getRules.and.returnValue(throwError(error));

    let errorResult: any;
    service.rules$.subscribe({
      next: () => {},
      error: (err) => errorResult = err
    });

    service.loadRules();
    tick();

    expect(errorResult).toBeTruthy();
  }));
});
```

#### Testing HTTP Services

```typescript
describe('RulesApiService', () => {
  let service: RulesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RulesApiService,
        { provide: API_CONFIG, useValue: mockApiConfig }
      ]
    });

    service = TestBed.inject(RulesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch rules via HTTP GET', () => {
    const mockRules: Rule[] = [
      { id: '1', name: 'Test Rule', status: 'active', type: 'filter' }
    ];

    service.getRules().subscribe(rules => {
      expect(rules).toEqual(mockRules);
    });

    const req = httpMock.expectOne('/api/rules');
    expect(req.request.method).toBe('GET');
    req.flush(mockRules);
  });

  it('should handle HTTP errors', () => {
    service.getRules().subscribe({
      next: () => fail('Expected error'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/rules');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
```

### Component Testing

#### Basic Component Test Setup

```typescript
describe('RulesComponent', () => {
  let component: RulesComponent;
  let fixture: ComponentFixture<RulesComponent>;
  let mockRulesService: jasmine.SpyObj<RulesService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('RulesService', ['getRules', 'selectRule']);

    await TestBed.configureTestingModule({
      imports: [RulesComponent, NoopAnimationsModule],
      providers: [
        { provide: RulesService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RulesComponent);
    component = fixture.componentInstance;
    mockRulesService = TestBed.inject(RulesService) as jasmine.SpyObj<RulesService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

#### Testing Component Behavior

```typescript
describe('RulesComponent Behavior', () => {
  it('should load rules on init', fakeAsync(() => {
    const mockRules: Rule[] = [
      { id: '1', name: 'Test Rule', status: 'active', type: 'filter' }
    ];
    mockRulesService.rules$ = of(mockRules);

    component.ngOnInit();
    tick();

    expect(component.rules).toEqual(mockRules);
  }));

  it('should select rule when clicked', () => {
    const rule: Rule = { id: '1', name: 'Test Rule', status: 'active', type: 'filter' };

    component.onRuleSelect(rule);

    expect(mockRulesService.selectRule).toHaveBeenCalledWith(rule);
  });

  it('should show loading state', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('.loading-spinner'));
    expect(loadingElement).toBeTruthy();
  });
});
```

#### Testing Component DOM

```typescript
describe('RulesComponent DOM', () => {
  it('should render rule list', fakeAsync(() => {
    const mockRules: Rule[] = [
      { id: '1', name: 'Rule 1', status: 'active', type: 'filter' },
      { id: '2', name: 'Rule 2', status: 'paused', type: 'transform' }
    ];
    
    component.rules = mockRules;
    fixture.detectChanges();
    tick();

    const ruleElements = fixture.debugElement.queryAll(By.css('.rule-item'));
    expect(ruleElements.length).toBe(2);
    expect(ruleElements[0].nativeElement.textContent).toContain('Rule 1');
    expect(ruleElements[1].nativeElement.textContent).toContain('Rule 2');
  }));

  it('should emit events on button click', () => {
    spyOn(component.ruleSelected, 'emit');
    const rule: Rule = { id: '1', name: 'Test Rule', status: 'active', type: 'filter' };
    
    component.rules = [rule];
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.rule-item button'));
    button.nativeElement.click();

    expect(component.ruleSelected.emit).toHaveBeenCalledWith(rule);
  });
});
```

### Testing Forms

#### Reactive Forms Testing

```typescript
describe('ProfileComponent Form', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create form with initial values', () => {
    component.ngOnInit();

    expect(component.profileForm.get('name')?.value).toBe('');
    expect(component.profileForm.get('email')?.value).toBe('');
  });

  it('should validate required fields', () => {
    component.ngOnInit();
    
    const nameControl = component.profileForm.get('name');
    nameControl?.setValue('');
    nameControl?.markAsTouched();

    expect(nameControl?.invalid).toBeTruthy();
    expect(nameControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    component.ngOnInit();
    
    const emailControl = component.profileForm.get('email');
    emailControl?.setValue('invalid-email');

    expect(emailControl?.invalid).toBeTruthy();
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('should submit valid form', () => {
    spyOn(component, 'onSubmit');
    component.ngOnInit();
    
    component.profileForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com'
    });

    const form = fixture.debugElement.query(By.css('form'));
    form.nativeElement.dispatchEvent(new Event('submit'));

    expect(component.onSubmit).toHaveBeenCalled();
  });
});
```

### Testing Directives

```typescript
describe('HighlightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    template: '<div appHighlight="yellow">Test Content</div>'
  })
  class TestComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [HighlightDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should apply highlight color', () => {
    fixture.detectChanges();
    
    const div = fixture.debugElement.query(By.css('div'));
    expect(div.nativeElement.style.backgroundColor).toBe('yellow');
  });
});
```

## Integration Testing

### Component-Service Integration

```typescript
describe('Rules Component Integration', () => {
  let component: RulesComponent;
  let fixture: ComponentFixture<RulesComponent>;
  let rulesService: RulesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RulesComponent,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        RulesService,
        { provide: RULES_API_SERVICE, useClass: RulesApiMockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RulesComponent);
    component = fixture.componentInstance;
    rulesService = TestBed.inject(RulesService);
  });

  it('should load and display rules from service', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(component.rules.length).toBeGreaterThan(0);
    
    const ruleElements = fixture.debugElement.queryAll(By.css('.rule-item'));
    expect(ruleElements.length).toBe(component.rules.length);
  }));

  it('should handle service errors gracefully', fakeAsync(() => {
    spyOn(rulesService, 'getRules').and.returnValue(
      throwError('Service Error')
    );

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    
    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement).toBeTruthy();
  }));
});
```

### Router Testing

```typescript
describe('App Routing Integration', () => {
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes([
          { path: 'rules', component: RulesComponent },
          { path: 'dashboard', component: DashboardComponent },
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should navigate to rules page', fakeAsync(() => {
    router.navigate(['/rules']);
    tick();

    expect(location.path()).toBe('/rules');
  }));

  it('should redirect to dashboard by default', fakeAsync(() => {
    router.navigate(['']);
    tick();

    expect(location.path()).toBe('/dashboard');
  }));
});
```

## End-to-End Testing

### E2E Framework Setup

We use **Cypress** for E2E testing:

```bash
# Install Cypress
npm install --save-dev cypress

# Open Cypress Test Runner
npx cypress open

# Run tests headlessly
npx cypress run
```

### E2E Test Structure

```typescript
// cypress/e2e/rules.cy.ts
describe('Rules Management', () => {
  beforeEach(() => {
    cy.visit('/rules');
    cy.login('test@example.com', 'password');
  });

  it('should display rules list', () => {
    cy.get('[data-cy=rules-list]').should('be.visible');
    cy.get('[data-cy=rule-item]').should('have.length.at.least', 1);
  });

  it('should create new rule', () => {
    cy.get('[data-cy=create-rule-btn]').click();
    cy.get('[data-cy=rule-name-input]').type('Test Rule');
    cy.get('[data-cy=rule-description-input]').type('Test Description');
    cy.get('[data-cy=rule-type-select]').select('filter');
    cy.get('[data-cy=save-rule-btn]').click();

    cy.get('[data-cy=success-message]').should('contain', 'Rule created successfully');
    cy.get('[data-cy=rules-list]').should('contain', 'Test Rule');
  });

  it('should edit existing rule', () => {
    cy.get('[data-cy=rule-item]').first().click();
    cy.get('[data-cy=edit-rule-btn]').click();
    cy.get('[data-cy=rule-name-input]').clear().type('Updated Rule Name');
    cy.get('[data-cy=save-rule-btn]').click();

    cy.get('[data-cy=success-message]').should('contain', 'Rule updated successfully');
  });
});
```

### Custom Cypress Commands

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createRule(name: string, type: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-btn]').click();
  cy.url().should('not.include', '/auth');
});

Cypress.Commands.add('createRule', (name: string, type: string) => {
  cy.get('[data-cy=create-rule-btn]').click();
  cy.get('[data-cy=rule-name-input]').type(name);
  cy.get('[data-cy=rule-type-select]').select(type);
  cy.get('[data-cy=save-rule-btn]').click();
});
```

## Test Data Management

### Test Fixtures

```typescript
// cypress/fixtures/rules.json
{
  "mockRules": [
    {
      "id": "1",
      "name": "Work Hours Filter",
      "description": "Only sync events during work hours",
      "status": "active",
      "type": "filter"
    },
    {
      "id": "2", 
      "name": "Meeting Transform",
      "description": "Add prefix to meeting titles",
      "status": "active",
      "type": "transform"
    }
  ]
}
```

### Mock Data for Tests

```typescript
// src/testing/mock-data.ts
export const MOCK_RULES: Rule[] = [
  {
    id: '1',
    name: 'Test Rule 1',
    description: 'Test Description 1',
    status: 'active',
    type: 'filter',
    lastModified: '2025-01-15 14:30',
    code: '// Test code'
  },
  {
    id: '2',
    name: 'Test Rule 2', 
    description: 'Test Description 2',
    status: 'paused',
    type: 'transform',
    lastModified: '2025-01-14 16:45',
    code: '// Test code 2'
  }
];

export const MOCK_USER: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  timezone: 'America/New_York',
  language: 'en',
  joinedDate: '2023-01-01',
  lastLogin: '2025-01-15 09:30'
};
```

## Testing Best Practices

### Test Organization

1. **Group related tests**
   ```typescript
   describe('RulesService', () => {
     describe('getRules', () => {
       it('should return rules from API', () => {});
       it('should handle API errors', () => {});
     });

     describe('saveRule', () => {
       it('should save new rule', () => {});
       it('should update existing rule', () => {});
     });
   });
   ```

2. **Use descriptive test names**
   ```typescript
   // ✅ Good
   it('should display error message when API returns 500', () => {});
   
   // ❌ Avoid
   it('should handle error', () => {});
   ```

3. **Follow AAA pattern**
   ```typescript
   it('should save rule when form is valid', () => {
     // Arrange
     const rule: Rule = { name: 'Test', type: 'filter' };
     component.ruleForm.patchValue(rule);

     // Act
     component.saveRule();

     // Assert
     expect(mockService.saveRule).toHaveBeenCalledWith(rule);
   });
   ```

### Test Isolation

1. **Reset state between tests**
   ```typescript
   afterEach(() => {
     fixture.destroy();
     TestBed.resetTestingModule();
   });
   ```

2. **Mock external dependencies**
   ```typescript
   beforeEach(() => {
     const spy = jasmine.createSpyObj('ExternalService', ['method']);
     TestBed.configureTestingModule({
       providers: [{ provide: ExternalService, useValue: spy }]
     });
   });
   ```

### Performance Testing

1. **Test bundle size**
   ```bash
   ng build --stats-json
   npx webpack-bundle-analyzer dist/calendars-cc/browser/stats.json
   ```

2. **Measure change detection cycles**
   ```typescript
   it('should not trigger excessive change detection', () => {
     const cycles = fixture.componentRef.injector.get(ChangeDetectorRef);
     spyOn(cycles, 'detectChanges');
     
     component.performAction();
     
     expect(cycles.detectChanges).toHaveBeenCalledTimes(1);
   });
   ```

## Continuous Integration

### GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
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
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test -- --watch=false --browsers=ChromeHeadless --code-coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
    
    - name: Run E2E tests
      run: npm run e2e:ci
```

## Test Coverage

### Coverage Configuration

```typescript
// karma.conf.js
module.exports = function(config) {
  config.set({
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        }
      }
    }
  });
};
```

### Coverage Goals

- **Statements**: 80% minimum
- **Branches**: 75% minimum  
- **Functions**: 80% minimum
- **Lines**: 80% minimum

### Excluding Files from Coverage

```typescript
// Files to exclude from coverage
/* istanbul ignore next */
export class UtilityClass {
  // Utility methods that don't need testing
}
```

## Debugging Tests

### VS Code Configuration

```json
{
  "name": "Debug Tests",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:9876/debug.html",
  "webRoot": "${workspaceFolder}",
  "sourceMaps": true,
  "userDataDir": "${workspaceFolder}/.vscode/chrome"
}
```

### Browser Debugging

```typescript
describe('Debug Test', () => {
  it('should debug in browser', () => {
    debugger; // Will stop execution in browser dev tools
    expect(true).toBe(true);
  });
});
```

This comprehensive testing guide ensures high-quality, maintainable code through proper testing practices and tools.
