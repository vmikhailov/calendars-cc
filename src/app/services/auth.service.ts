import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthUser, AuthResponse, LoginRequest, SignupRequest, AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authStateSubject.next({
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null
        });
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.setLoading(true);
    
    // Mock authentication - in real app, this would be an HTTP call
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Mock validation
        if (credentials.email === 'demo@example.com' && credentials.password === 'df434234sadf331!@#!') {
          const response: AuthResponse = {
            user: {
              id: '1',
              name: 'Demo User',
              email: credentials.email,
              role: 'user',
              verified: true
            },
            token: 'mock_jwt_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now()
          };
          
          this.setAuthData(response);
          return response;
        } else {
          this.setError('Invalid email or password');
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  signup(userData: SignupRequest): Observable<AuthResponse> {
    this.setLoading(true);
    
    return of(null).pipe(
      delay(1000),
      map(() => {
        if (userData.password !== userData.confirmPassword) {
          this.setError('Passwords do not match');
          throw new Error('Passwords do not match');
        }

        const response: AuthResponse = {
          user: {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            role: 'user',
            verified: false
          },
          token: 'mock_jwt_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now()
        };
        
        this.setAuthData(response);
        return response;
      })
    );
  }

  logout(): void {
    this.clearAuth();
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    
    this.authStateSubject.next({
      isAuthenticated: true,
      user: response.user,
      token: response.token,
      loading: false,
      error: null
    });
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
  }

  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      loading,
      error: null
    });
  }

  private setError(error: string): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      loading: false,
      error
    });
  }

  getCurrentUser(): AuthUser | null {
    return this.authStateSubject.value.user;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }
}