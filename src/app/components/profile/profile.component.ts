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
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
        <p class="text-gray-600">Manage your personal information and account settings</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Picture -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
            
            <div class="text-center">
              <div class="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span class="text-3xl font-bold text-white">{{ getInitials() }}</span>
              </div>
              
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-2">
                <lucide-icon name="upload" class="h-4 w-4 inline mr-2"></lucide-icon>
                Upload Photo
              </button>
              
              <p class="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Personal Information</h2>
              <button
                *ngIf="!isEditing"
                (click)="startEdit()"
                class="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <lucide-icon name="edit" class="h-4 w-4"></lucide-icon>
                <span>Edit</span>
              </button>
            </div>

            <form (ngSubmit)="saveProfile()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    [(ngModel)]="editableUser.name"
                    name="name"
                    [readonly]="!isEditing"
                    [class]="getInputClass()"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    [(ngModel)]="editableUser.email"
                    name="email"
                    [readonly]="!isEditing"
                    [class]="getInputClass()"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    [(ngModel)]="editableUser.company"
                    name="company"
                    [readonly]="!isEditing"
                    [class]="getInputClass()"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    [(ngModel)]="editableUser.role"
                    name="role"
                    [readonly]="!isEditing"
                    [class]="getInputClass()"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    [(ngModel)]="editableUser.timezone"
                    name="timezone"
                    [disabled]="!isEditing"
                    [class]="getInputClass()"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    [(ngModel)]="editableUser.language"
                    name="language"
                    [disabled]="!isEditing"
                    [class]="getInputClass()"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
              </div>

              <div *ngIf="isEditing" class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  (click)="cancelEdit()"
                  class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Account Information -->
      <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
            <div class="text-gray-900">{{ formatDate(user?.joinedDate) }}</div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
            <div class="text-gray-900">{{ user?.lastLogin }}</div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="mt-8 bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <h2 class="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
        <p class="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        
        <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          <lucide-icon name="trash-2" class="h-4 w-4 inline mr-2"></lucide-icon>
          Delete Account
        </button>
      </div>
    </div>
  `
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