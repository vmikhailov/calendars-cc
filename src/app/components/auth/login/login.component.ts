import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    credentials: LoginRequest = {
        email: '',
        password: ''
    };

    showPassword = false;
    loading = false;
    error: string | null = null;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.authService.authState$
            .pipe(takeUntil(this.destroy$))
            .subscribe(state => {
                this.loading = state.loading;
                this.error = state.error;

                if (state.isAuthenticated) {
                    this.router.navigate(['/dashboard']);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSubmit(): void {
        if (this.credentials.email && this.credentials.password) {
            this.authService.login(this.credentials).subscribe({
                next: () => {
                    // Navigation handled in ngOnInit
                },
                error: (error) => {
                    console.error('Login failed:', error);
                }
            });
        }
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    navigateToSignup(): void {
        this.router.navigate(['/auth/signup']);
    }

    // Demo credentials helper
    fillDemoCredentials(): void {
        this.credentials.email = 'demo@example.com';
        this.credentials.password = 'df434234sadf331!@#!';
    }

  // Social login methods
  loginWithGoogle(): void {
    // In a real app, this would integrate with Google OAuth
    console.log('Login with Google');
    // For demo purposes, simulate successful login
    this.authService.login({
      email: 'google.user@gmail.com',
      password: 'df434234sadf331!@#!'
    }).subscribe();
  }

  loginWithMicrosoft(): void {
    // In a real app, this would integrate with Microsoft OAuth
    console.log('Login with Microsoft');
    // For demo purposes, simulate successful login
    this.authService.login({
      email: 'microsoft.user@outlook.com',
      password: 'df434234sadf331!@#!'
    }).subscribe();
  }

  loginWithGitHub(): void {
    // In a real app, this would integrate with GitHub OAuth
    console.log('Login with GitHub');
    // For demo purposes, simulate successful login
    this.authService.login({
      email: 'github.user@github.com',
      password: 'df434234sadf331!@#!'
    }).subscribe();
  }
}