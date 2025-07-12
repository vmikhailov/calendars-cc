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
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p class="text-gray-600">Manage your application preferences and configurations</p>
      </div>

      <div class="space-y-8">
        <!-- Notifications -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Notifications</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Email Notifications</h3>
                <p class="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.notifications.email"
                  (change)="updateSettings()"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Push Notifications</h3>
                <p class="text-sm text-gray-600">Receive push notifications in your browser</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.notifications.push"
                  (change)="updateSettings()"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Sync Error Alerts</h3>
                <p class="text-sm text-gray-600">Get notified when sync errors occur</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.notifications.syncErrors"
                  (change)="updateSettings()"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Weekly Report</h3>
                <p class="text-sm text-gray-600">Receive weekly sync summary reports</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.notifications.weeklyReport"
                  (change)="updateSettings()"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Sync Settings -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Sync Settings</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Default Sync Frequency</label>
              <select
                [(ngModel)]="settings.sync.frequency"
                (change)="updateSettings()"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5min">Every 5 minutes</option>
                <option value="15min">Every 15 minutes</option>
                <option value="30min">Every 30 minutes</option>
                <option value="1hour">Every hour</option>
                <option value="6hours">Every 6 hours</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Auto Retry Failed Syncs</h3>
                <p class="text-sm text-gray-600">Automatically retry when sync fails</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.sync.autoRetry"
                  (change)="updateSettings()"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div *ngIf="settings.sync.autoRetry">
              <label class="block text-sm font-medium text-gray-700 mb-2">Maximum Retry Attempts</label>
              <select
                [(ngModel)]="settings.sync.maxRetries"
                (change)="updateSettings()"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 attempt</option>
                <option value="3">3 attempts</option>
                <option value="5">5 attempts</option>
                <option value="10">10 attempts</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Privacy</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Share Usage Data</h3>
                <p class="text-sm text-gray-600">Help improve the app by sharing anonymous usage data</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.privacy.shareUsageData"
                  (change)="updateSettings()"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Allow Analytics</h3>
                <p class="text-sm text-gray-600">Enable analytics to help us understand app usage</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.privacy.allowAnalytics"
                  (change)="updateSettings()"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Appearance -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Appearance</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  *ngFor="let theme of themes"
                  (click)="setTheme(theme.value)"
                  [class]="getThemeButtonClass(theme.value)"
                >
                  <lucide-icon [name]="theme.icon" class="h-4 w-4 mb-1"></lucide-icon>
                  <span class="text-sm">{{ theme.label }}</span>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Compact Mode</h3>
                <p class="text-sm text-gray-600">Use a more compact layout to fit more content</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.appearance.compactMode"
                  (change)="updateSettings()"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Data Management -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Data Management</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Export Data</h3>
                <p class="text-sm text-gray-600">Download all your sync rules and settings</p>
              </div>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <lucide-icon name="download" class="h-4 w-4 inline mr-2"></lucide-icon>
                Export
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Clear Cache</h3>
                <p class="text-sm text-gray-600">Clear all cached sync data</p>
              </div>
              <button class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <lucide-icon name="trash-2" class="h-4 w-4 inline mr-2"></lucide-icon>
                Clear
              </button>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <h3 class="font-medium text-red-900">Reset All Settings</h3>
                <p class="text-sm text-red-600">Reset all settings to default values</p>
              </div>
              <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                <lucide-icon name="refresh-cw" class="h-4 w-4 inline mr-2"></lucide-icon>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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