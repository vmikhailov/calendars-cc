import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AppSettings } from '../../models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  settings: AppSettings = {
    notifications: {
      email: true,
      push: true,
      syncErrors: true,
      weeklyReport: false
    },
    sync: {
      frequency: '15min',
      autoRetry: true,
      maxRetries: 3
    },
    privacy: {
      shareUsageData: false,
      allowAnalytics: true
    },
    appearance: {
      theme: 'light',
      compactMode: false
    }
  };

  themes = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'auto', label: 'Auto', icon: 'monitor' }
  ] as const;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        this.settings = { ...settings };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateSettings(): void {
    this.userService.updateSettings(this.settings);
  }

  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.settings.appearance.theme = theme;
    this.updateSettings();
  }

  getThemeButtonClass(theme: string): string {
    const baseClass = 'flex flex-col items-center p-3 border rounded-lg transition-all hover:bg-gray-50';
    return this.settings.appearance.theme === theme
      ? `${baseClass} border-blue-500 bg-blue-50 text-blue-700`
      : `${baseClass} border-gray-200 text-gray-700`;
  }
}