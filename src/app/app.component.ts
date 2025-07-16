import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { LucideAngularModule, Calendar, User, CreditCard, Settings, FileText, Code } from 'lucide-angular';
import { Subject, takeUntil, filter, Observable } from 'rxjs';
import { NavigationComponent } from './components/navigation/navigation.component';
import { TechInfoComponent } from './components/tech-info/tech-info.component';
import { NavigationService } from './services/navigation.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    NavigationComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  activeSection = 'dashboard';
  isAuthenticated = false;

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Listen to router events to update active section
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        if (url.includes('/auth/')) {
          return; // Don't update section for auth routes
        }

        const section = url.substring(1) || 'dashboard';
        this.activeSection = section;
        this.navigationService.setActiveSection(section);
      });

    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isAuthenticated = state.isAuthenticated;
        if (!state.isAuthenticated && !this.router.url.includes('/auth/')) {
          this.router.navigate(['/auth/login']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMainClass(): string {
    return this.activeSection === 'logs' || this.activeSection === 'rules' || this.activeSection === 'calendars'
      ? 'p-5 flex flex-col lg:flex-1'
      : 'p-5 lg:flex-1';
  }
}