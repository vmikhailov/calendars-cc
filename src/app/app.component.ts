import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, User, CreditCard, Settings, FileText, Code } from 'lucide-angular';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SyncLogsComponent } from './components/sync-logs/sync-logs.component';
import { CalendarsComponent } from './components/calendars/calendars.component';
import { RulesComponent } from './components/rules/rules.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BillingComponent } from './components/billing/billing.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NavigationService } from './services/navigation.service';

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
    SettingsComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <app-navigation></app-navigation>
      
      <main [class]="getMainClass()">
        <ng-container [ngSwitch]="activeSection">
          <app-dashboard *ngSwitchCase="'dashboard'"></app-dashboard>
          <app-calendars *ngSwitchCase="'calendars'"></app-calendars>
          <app-rules *ngSwitchCase="'rules'"></app-rules>
          <app-sync-logs *ngSwitchCase="'logs'"></app-sync-logs>
          <app-profile *ngSwitchCase="'profile'"></app-profile>
          <app-billing *ngSwitchCase="'billing'"></app-billing>
          <app-settings *ngSwitchCase="'settings'"></app-settings>
          
          <!-- Default case for unknown sections -->
          <div *ngSwitchDefault class="text-center py-12">
            <lucide-icon name="alert-circle" class="h-12 w-12 text-gray-300 mx-auto mb-4"></lucide-icon>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Page Not Found</h3>
            <p class="text-gray-600">The requested section could not be found</p>
          </div>
        </ng-container>
      </main>
    </div>
  `
})
export class AppComponent implements OnInit {
  activeSection = 'dashboard';

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService.activeSection$.subscribe(section => {
      this.activeSection = section;
    });
  }

  getMainClass(): string {
    return this.activeSection === 'logs' || this.activeSection === 'rules' || this.activeSection === 'calendars'
      ? 'flex-1 p-8 flex flex-col'
      : 'flex-1 p-8';
  }
}