# Contributing to Calendars CC

We're excited that you're interested in contributing to Calendars CC! This document provides guidelines and information for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Standards](#coding-standards)
5. [Submitting Changes](#submitting-changes)
6. [Issue Guidelines](#issue-guidelines)
7. [Security](#security)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** installed and configured
- **Angular CLI** 17.x
- A **GitHub account**

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/calendars-cc.git
   cd calendars-cc
   ```

2. **Add the upstream repository**
   ```bash
   git remote add upstream https://github.com/vmikhailov/calendars-cc.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Verify everything works**
   - Navigate to `http://localhost:4200`
   - Ensure the application loads correctly

## Development Process

### Branch Strategy

We use the following branch structure:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### Workflow

1. **Create a feature branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Coding Standards

### TypeScript Guidelines

1. **Use strict typing**
   ```typescript
   // ✅ Good
   interface User {
     id: string;
     name: string;
     email: string;
   }

   function getUser(id: string): Observable<User> {
     return this.http.get<User>(`/api/users/${id}`);
   }

   // ❌ Avoid
   function getUser(id: any): any {
     return this.http.get(`/api/users/${id}`);
   }
   ```

2. **Use meaningful names**
   ```typescript
   // ✅ Good
   const activeUserRules = rules.filter(rule => rule.status === 'active');
   
   // ❌ Avoid
   const arr = rules.filter(r => r.status === 'active');
   ```

3. **Follow Angular conventions**
   ```typescript
   // ✅ Component naming
   @Component({
     selector: 'app-rule-editor',
     templateUrl: './rule-editor.component.html'
   })
   export class RuleEditorComponent implements OnInit, OnDestroy {
     // Component logic
   }
   ```

### Angular Component Guidelines

1. **Use standalone components**
   ```typescript
   @Component({
     selector: 'app-feature',
     standalone: true,
     imports: [CommonModule, FormsModule],
     templateUrl: './feature.component.html'
   })
   export class FeatureComponent {
     // Component logic
   }
   ```

2. **Implement proper lifecycle management**
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

3. **Use OnPush change detection when possible**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

### CSS/SCSS Guidelines

1. **Use Tailwind CSS utilities first**
   ```html
   <!-- ✅ Good -->
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

3. **Use CSS custom properties for themes**
   ```scss
   :root {
     --primary-color: #3b82f6;
     --secondary-color: #64748b;
   }
   ```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(rules): add rule duplication functionality
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
style(components): format code according to standards
refactor(services): extract common API logic
test(rules): add unit tests for RulesService
chore(deps): update Angular to version 17.1
```

## Submitting Changes

### Pull Request Process

1. **Ensure your code meets quality standards**
   - All tests pass
   - Code follows style guidelines
   - No linting errors
   - Documentation is updated

2. **Fill out the PR template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] Manual testing completed
   - [ ] No regressions identified

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] Tests added for new functionality
   ```

3. **Request review**
   - Assign appropriate reviewers
   - Respond to feedback promptly
   - Make requested changes

### Review Process

All submissions require review. We use GitHub pull requests for this purpose:

1. **Automated checks**
   - CI/CD pipeline must pass
   - All tests must pass
   - Code coverage maintained

2. **Manual review**
   - Code quality and standards
   - Architecture and design
   - Security considerations
   - Performance implications

3. **Approval and merge**
   - At least one approval required
   - All conversations resolved
   - Up-to-date with target branch

## Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:

1. **Bug description**
   - Clear description of the issue
   - Expected vs actual behavior

2. **Reproduction steps**
   ```
   1. Go to '...'
   2. Click on '...'
   3. Scroll down to '...'
   4. See error
   ```

3. **Environment information**
   - Browser and version
   - Operating system
   - Application version
   - Any relevant console errors

4. **Screenshots or recordings**
   - Visual evidence of the issue
   - Browser developer tools output

### Feature Requests

When requesting features:

1. **Use case description**
   - What problem does this solve?
   - Who would benefit from this feature?

2. **Proposed solution**
   - How should this feature work?
   - Any specific requirements?

3. **Alternatives considered**
   - Other ways to solve the problem
   - Why this approach is preferred

### Issue Labels

We use the following labels:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority items
- `status: needs review` - Waiting for review

## Testing

### Running Tests

```bash
# Unit tests
npm run test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Linting
npm run lint

# Build verification
npm run build
```

### Writing Tests

1. **Unit tests for services**
   ```typescript
   describe('RulesService', () => {
     let service: RulesService;
     let httpMock: HttpTestingController;

     beforeEach(() => {
       TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [RulesService]
       });
       service = TestBed.inject(RulesService);
       httpMock = TestBed.inject(HttpTestingController);
     });

     it('should fetch rules', () => {
       const mockRules = [{ id: '1', name: 'Test Rule' }];
       
       service.getRules().subscribe(rules => {
         expect(rules).toEqual(mockRules);
       });

       const req = httpMock.expectOne('/api/rules');
       expect(req.request.method).toBe('GET');
       req.flush(mockRules);
     });
   });
   ```

2. **Component tests**
   ```typescript
   describe('RuleEditorComponent', () => {
     let component: RuleEditorComponent;
     let fixture: ComponentFixture<RuleEditorComponent>;

     beforeEach(async () => {
       await TestBed.configureTestingModule({
         imports: [RuleEditorComponent]
       }).compileComponents();

       fixture = TestBed.createComponent(RuleEditorComponent);
       component = fixture.componentInstance;
     });

     it('should create', () => {
       expect(component).toBeTruthy();
     });
   });
   ```

### Test Coverage

We aim for:
- **Minimum 80%** overall test coverage
- **90%+** for business logic services
- **Critical paths** must be fully tested

## Documentation

### Code Documentation

1. **JSDoc comments for public APIs**
   ```typescript
   /**
    * Saves a synchronization rule
    * @param rule The rule to save
    * @returns Observable of the saved rule
    */
   saveRule(rule: Rule): Observable<Rule> {
     return this.api.saveRule(rule);
   }
   ```

2. **README updates**
   - Update installation instructions
   - Document new features
   - Include usage examples

3. **API documentation**
   - Update API.md for new endpoints
   - Include request/response examples
   - Document error responses

### Updating Documentation

When making changes that affect:

- **User interface**: Update USER_GUIDE.md
- **API endpoints**: Update API.md  
- **Development setup**: Update DEVELOPMENT.md
- **Deployment process**: Update DEPLOYMENT.md

## Security

### Reporting Security Vulnerabilities

**Do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to security@calendars.cc with:

1. **Description of the vulnerability**
2. **Steps to reproduce**
3. **Potential impact**
4. **Suggested fix (if any)**

We will respond within 48 hours and work with you to resolve the issue.

### Security Guidelines

1. **Never commit sensitive data**
   - API keys, passwords, or tokens
   - Personal information
   - Production configuration

2. **Validate all inputs**
   ```typescript
   // ✅ Good
   if (!email || !this.isValidEmail(email)) {
     throw new Error('Invalid email address');
   }
   ```

3. **Use HTTPS in production**
4. **Sanitize user inputs**
5. **Follow OWASP guidelines**

## Community

### Getting Help

- **GitHub Discussions**: General questions and discussions
- **GitHub Issues**: Bug reports and feature requests
- **Email**: For security-related concerns

### Recognition

Contributors will be recognized in:
- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **Annual contributor highlights**

## License

By contributing to Calendars CC, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Calendars CC! Your involvement helps make calendar synchronization better for everyone.
