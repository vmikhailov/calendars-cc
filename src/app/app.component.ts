import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, User, CreditCard, Settings, FileText, Code } from 'lucide-angular';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SyncLogsComponent } from './components/sync-logs/sync-logs.component';
import { RulesComponent } from './components/rules/rules.component';
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
    RulesComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <app-navigation></app-navigation>
      
      <main [class]="getMainClass()">
        <ng-container [ngSwitch]="activeSection">
          <app-dashboard *ngSwitchCase="'dashboard'"></app-dashboard>
          <app-sync-logs *ngSwitchCase="'logs'"></app-sync-logs>
          <app-rules *ngSwitchCase="'rules'"></app-rules>
          
          <!-- Placeholder components for other sections -->
          <div *ngSwitchCase="'profile'" class="text-center py-12">
            <lucide-icon name="user" class="h-12 w-12 text-gray-300 mx-auto mb-4"></lucide-icon>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
            <p class="text-gray-600">Profile component coming soon</p>
          </div>
          
          <div *ngSwitchCase="'billing'" class="text-center py-12">
            <lucide-icon name="credit-card" class="h-12 w-12 text-gray-300 mx-auto mb-4"></lucide-icon>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Billing</h3>
            <p class="text-gray-600">Billing component coming soon</p>
          </div>
          
          <div *ngSwitchCase="'settings'" class="text-center py-12">
            <lucide-icon name="settings" class="h-12 w-12 text-gray-300 mx-auto mb-4"></lucide-icon>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
            <p class="text-gray-600">Settings component coming soon</p>
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
    return this.activeSection === 'logs' || this.activeSection === 'rules'
      ? 'flex-1 p-8 flex flex-col'
      : 'flex-1 p-8';
  }
}