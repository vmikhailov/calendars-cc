import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { SignupRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  userData: SignupRequest = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  error: string | null = null;
  acceptTerms = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
    if (this.isFormValid()) {
      this.authService.signup(this.userData).subscribe({
        next: () => {
          // Navigation handled in ngOnInit
        },
        error: (error) => {
          console.error('Signup failed:', error);
        }
      });
    }
  }

  isFormValid(): boolean {
    return !!(
      this.userData.name &&
      this.userData.email &&
      this.userData.password &&
      this.userData.confirmPassword &&
      this.userData.password === this.userData.confirmPassword &&
      this.acceptTerms
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  getPasswordStrength(): { strength: string; color: string; width: string } {
    const password = this.userData.password;
    if (!password) return { strength: '', color: '', width: '0%' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        return { strength: 'Weak', color: 'bg-red-500', width: '20%' };
      case 2:
        return { strength: 'Fair', color: 'bg-yellow-500', width: '40%' };
      case 3:
        return { strength: 'Good', color: 'bg-blue-500', width: '60%' };
      case 4:
        return { strength: 'Strong', color: 'bg-green-500', width: '80%' };
      case 5:
        return { strength: 'Very Strong', color: 'bg-green-600', width: '100%' };
      default:
        return { strength: '', color: '', width: '0%' };
    }
  }
}