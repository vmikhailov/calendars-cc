import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';
import { menuItems, MenuItem } from '../../models/menu-item.model';
import { AuthUser } from '../../models/auth.model';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  menuItems = menuItems;
  activeSection = 'dashboard';
  user: AuthUser | null = null;
  showUserMenu = false;

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
        this.user = state.user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSectionChange(section: string): void {
    this.router.navigate([`/${section}`]);
    this.showUserMenu = false;
  }

  getButtonClass(itemId: string): string {
    const baseClass = 'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group';
    return this.activeSection === itemId
      ? `${baseClass} bg-primary-50 text-primary-700 border border-primary-200`
      : `${baseClass} text-gray-600 hover:bg-gray-50 hover:text-gray-900`;
  }

  getIconClass(itemId: string): string {
    const baseClass = 'h-5 w-5';
    return this.activeSection === itemId
      ? `${baseClass} text-primary-600`
      : `${baseClass} text-gray-400 group-hover:text-gray-600`;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.showUserMenu = false;
  }

  getUserInitials(): string {
    if (!this.user?.name) return 'U';
    return this.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}