import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationService } from '../../services/navigation.service';
import { menuItems, MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <nav class="bg-white border-r border-gray-200 w-64 min-h-screen">
      <div class="p-6">
        <div class="flex items-center space-x-3 mb-8">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <lucide-icon name="calendar" class="h-6 w-6 text-white"></lucide-icon>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">CalendarSync</h1>
            <p class="text-sm text-gray-500">Calendar Synchronization</p>
          </div>
        </div>

        <div class="space-y-2">
          <button
            *ngFor="let item of menuItems"
            (click)="onSectionChange(item.id)"
            [class]="getButtonClass(item.id)"
          >
            <lucide-icon 
              [name]="item.icon" 
              [class]="getIconClass(item.id)"
            ></lucide-icon>
            <div class="flex-1 min-w-0">
              <div class="font-medium">{{ item.label }}</div>
              <div class="text-xs text-gray-500 mt-0.5 truncate">
                {{ item.description }}
              </div>
            </div>
          </button>
        </div>
      </div>
    </nav>
  `
})
export class NavigationComponent implements OnInit {
  menuItems = menuItems;
  activeSection = 'dashboard';

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService.activeSection$.subscribe(section => {
      this.activeSection = section;
    });
  }

  onSectionChange(section: string): void {
    this.navigationService.setActiveSection(section);
  }

  getButtonClass(itemId: string): string {
    const baseClass = 'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group';
    return this.activeSection === itemId
      ? `${baseClass} bg-blue-50 text-blue-700 border border-blue-200`
      : `${baseClass} text-gray-600 hover:bg-gray-50 hover:text-gray-900`;
  }

  getIconClass(itemId: string): string {
    const baseClass = 'h-5 w-5';
    return this.activeSection === itemId
      ? `${baseClass} text-blue-600`
      : `${baseClass} text-gray-400 group-hover:text-gray-600`;
  }
}