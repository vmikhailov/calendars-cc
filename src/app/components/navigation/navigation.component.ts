import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationService } from '../../services/navigation.service';
import { menuItems, MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './navigation.component.html'
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
      ? `${baseClass} bg-primary-50 text-primary-700 border border-primary-200`
      : `${baseClass} text-muted hover:bg-secondary-50 hover:text-default`;
  }

  getIconClass(itemId: string): string {
    const baseClass = 'h-5 w-5';
    return this.activeSection === itemId
      ? `${baseClass} text-primary-600`
      : `${baseClass} text-light group-hover:text-muted`;
  }
}