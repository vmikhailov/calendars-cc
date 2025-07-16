# API Services Guide

This guide explains how to create and structure API services in the `src/app/api-services` directory for Calendars CC. API services provide a mock or real API interface for Angular services and components, supporting both development (mock) and production (real API) modes.

## Directory Structure

- Place all API service code in `src/app/api-services/`.
- Create a separate subfolder for each domain (e.g., `billing`, `rules`, `calendar`, `settings`).
- Each domain folder should include the following files:
    - `interface.ts`  
        - Defines the `I<Domain>ApiService` TypeScript interface for the domain.
        - Declares the corresponding `InjectionToken` for dependency injection.
    - `service.ts`  
        - Implements `I<Domain>ApiService` using Angular's `HttpClient` to communicate with the REST API.
        - Follows RESTful conventions for all endpoints and methods.
    - `mock-service.ts`  
        - Implements `I<Domain>ApiService` by returning mock data from `mock-data.ts`.
        - Useful for development and testing without a backend.
    - `mock-data.ts`  
        - Contains mock data structures and constants used by `mock-service.ts`.
- Keep interfaces, mock data, and service implementations modular and well-documented.
- Use consistent naming and structure across all domain folders for maintainability.
- **Always update `api-config.ts` and `api-providers.ts` to match currently implemented services:**
    - Register each new domain’s API service and its injection token in `api-providers.ts`.
    - Add or update endpoint URLs and configuration for each domain in `api-config.ts`.
    - Remove or update any entries for deleted or renamed services.
    - Keep these files in sync with the actual structure of `api-services/` to avoid DI or runtime errors.


## Service File Conventions

- The main API service should be a class named `<Domain>ApiService` (e.g., `BillingApiService`).
- Decorate the class with `@Injectable({ providedIn: 'root' })`.
- Export the class from `service.ts`.
- Use RxJS `Observable` for all API methods, even for mock data.
- Use mock data constants for development mode.
- Mock data must always go to a separate file.

## API Service Method Guidelines

- **Naming:** Use RESTful method names: `getAll`, `getById`, `create`, `update`, `delete`, etc.
- **Return Types:** Always return `Observable<T>`.
- **Mock Data:** Use in-memory arrays/objects for mock implementations.
- **Side Effects:** For mock APIs, update the mock data in-place (e.g., push, splice arrays).

## Integration with Angular Services

- Inject your API service into the corresponding Angular service (e.g., `BillingService`).
- The Angular service should subscribe to the API service and update its own state (e.g., with `BehaviorSubject`).
- This allows easy switching from mock to real API in the future.

## Adding a New API Service

1. Create a new folder under `api-services` for your domain (e.g., `calendar`).
2. Add a `service.ts` file and define your API service class.
3. Add mock data as needed.
4. Implement all required API methods as `Observable`.
5. Inject and use your API service in the corresponding Angular service.

## Best Practices

- Keep API services stateless except for mock data.
- Keep mock data and interfaces in separate files if large.
- Document all methods with JSDoc comments.
- Use TypeScript interfaces for all data models.

---

By following these conventions, you ensure all API services are consistent, testable, and easy to migrate to real backend APIs.
