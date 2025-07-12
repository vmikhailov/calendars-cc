import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  user: User | null = null;
  editableUser: User = {} as User;
  isEditing = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        this.editableUser = { ...user };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInitials(): string {
    if (!this.user?.name) return 'U';
    return this.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  startEdit(): void {
    this.isEditing = true;
    this.editableUser = { ...this.user! };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editableUser = { ...this.user! };
  }

  saveProfile(): void {
    this.userService.updateUser(this.editableUser);
    this.isEditing = false;
  }

  getInputClass(): string {
    const baseClass = 'w-full px-3 py-2 border rounded-lg transition-colors';
    return this.isEditing
      ? `${baseClass} border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`
      : `${baseClass} border-gray-200 bg-gray-50 text-gray-700`;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}