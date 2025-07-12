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
  templateUrl: './app.component.html'
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