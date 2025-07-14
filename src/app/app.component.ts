import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Calendar, User, CreditCard, Settings, FileText, Code } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SyncLogsComponent } from './components/sync-logs/sync-logs.component';
import { CalendarsComponent } from './components/calendars/calendars.component';
import { RulesComponent } from './components/rules/rules.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BillingComponent } from './components/billing/billing.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NavigationService } from './services/navigation.service';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule, 
    NavigationComponent, 
    DashboardComponent, 
    SyncLogsComponent,
    CalendarsComponent,
    RulesComponent,
    ProfileComponent,
    BillingComponent,
    SettingsComponent,
    LoginComponent,
    SignupComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  activeSection = 'dashboard';
  currentView: 'app' | 'login' | 'signup' = 'app';
  isAuthenticated = false;

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.navigationService.activeSection$.subscribe(section => {
      this.activeSection = section;
    });

    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isAuthenticated = state.isAuthenticated;
        if (!state.isAuthenticated) {
          this.currentView = 'login';
        } else {
          this.currentView = 'app';
        }
      });

    // Simple routing logic
    const path = window.location.pathname;
    if (path.includes('/auth/signup')) {
      this.currentView = 'signup';
    } else if (path.includes('/auth/login')) {
      this.currentView = 'login';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMainClass(): string {
    return this.activeSection === 'logs' || this.activeSection === 'rules' || this.activeSection === 'calendars'
      ? 'flex-1 p-8 flex flex-col'
      : 'flex-1 p-8';
  }

  navigateToLogin(): void {
    this.currentView = 'login';
    window.history.pushState({}, '', '/auth/login');
  }

  navigateToSignup(): void {
    this.currentView = 'signup';
    window.history.pushState({}, '', '/auth/signup');
  }

  navigateToDashboard(): void {
    this.currentView = 'app';
    window.history.pushState({}, '', '/dashboard');
  }
}