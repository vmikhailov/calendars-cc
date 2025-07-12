import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { LogEntry } from '../../models/rule.model';

@Component({
  selector: 'app-sync-logs',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="h-full flex flex-col">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-1">Sync Logs</h1>
              <p class="text-gray-600">Monitor synchronization activity and troubleshoot issues</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Activity Log</h2>
            
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  *ngFor="let filterOption of filterOptions"
                  (click)="setFilter(filterOption.value)"
                  [class]="getFilterButtonClass(filterOption.value)"
                >
                  {{ filterOption.label }} ({{ getFilterCount(filterOption.value) }})
                </button>
              </div>
              
              <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <lucide-icon name="filter" class="h-4 w-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <div class="space-y-3 p-6">
            <div
              *ngFor="let log of filteredLogs"
              [class]="'border rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm ' + getStatusColor(log.status)"
              (click)="toggleDetails(log.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <lucide-icon [name]="getStatusIcon(log.status)" [class]="getStatusIconClass(log.status)"></lucide-icon>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ log.message }}</div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ log.timestamp }} • {{ log.rule }}
                    </div>
                  </div>
                </div>
                
                <div *ngIf="log.details" class="text-xs text-gray-400">
                  {{ showDetails === log.id ? '▼' : '▶' }}
                </div>
              </div>
              
              <div *ngIf="showDetails === log.id && log.details" class="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                {{ log.details }}
              </div>
            </div>
          </div>

          <!-- Loading indicator -->
          <div #loadingRef class="p-6">
            <div *ngIf="loading" class="flex items-center justify-center space-x-2 text-gray-500">
              <lucide-icon name="loader" class="h-4 w-4 animate-spin"></lucide-icon>
              <span class="text-sm">Loading more logs...</span>
            </div>
            
            <div *ngIf="!hasMore && logs.length > 0" class="text-center text-gray-500 text-sm">
              No more logs to load
            </div>
          </div>
        </div>
        
        <div *ngIf="filteredLogs.length === 0 && !loading" class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <lucide-icon name="refresh-cw" class="h-8 w-8 text-gray-300 mx-auto mb-2"></lucide-icon>
            <p class="text-gray-500 text-sm">No logs to display</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SyncLogsComponent implements OnInit, OnDestroy {
  @ViewChild('loadingRef') loadingRef!: ElementRef;

  filter: 'all' | 'success' | 'error' | 'warning' = 'all';
  showDetails: string | null = null;
  logs: LogEntry[] = [];
  loading = false;
  hasMore = true;
  page = 0;
  pageSize = 20;

  private observer?: IntersectionObserver;

  filterOptions = [
    { value: 'all' as const, label: 'All' },
    { value: 'success' as const, label: 'Success' },
    { value: 'error' as const, label: 'Errors' },
    { value: 'warning' as const, label: 'Warnings' }
  ];

  ngOnInit(): void {
    this.loadInitialLogs();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private loadInitialLogs(): void {
    const initialLogs = this.generateLogs(0, this.pageSize);
    this.logs = initialLogs;
    this.page = 1;
  }

  private setupIntersectionObserver(): void {
    setTimeout(() => {
      if (this.loadingRef) {
        this.observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && this.hasMore && !this.loading) {
              this.loadMoreLogs();
            }
          },
          { threshold: 0.1 }
        );
        this.observer.observe(this.loadingRef.nativeElement);
      }
    });
  }

  private async loadMoreLogs(): Promise<void> {
    if (this.loading || !this.hasMore) return;
    
    this.loading = true;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newLogs = this.generateLogs(this.page, this.pageSize);
    
    if (newLogs.length < this.pageSize) {
      this.hasMore = false;
    }
    
    this.logs = [...this.logs, ...newLogs];
    this.page++;
    this.loading = false;
  }

  private generateLogs(page: number, pageSize: number): LogEntry[] {
    const logs: LogEntry[] = [];
    const statuses: ('success' | 'error' | 'warning')[] = ['success', 'error', 'warning'];
    const rules = ['Work → Main', 'Personal → Main', 'Family → Shared', 'Team → Project', 'Client → Work'];
    const messages = {
      success: ['Sync completed successfully', 'All events synchronized', 'Sync finished without errors'],
      error: ['Authorization error', 'Network timeout', 'Calendar not found', 'Rate limit exceeded'],
      warning: ['Sync paused by user', 'Partial sync completed', 'Some events skipped']
    };

    for (let i = 0; i < pageSize; i++) {
      const index = page * pageSize + i;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const rule = rules[Math.floor(Math.random() * rules.length)];
      const message = messages[status][Math.floor(Math.random() * messages[status].length)];
      
      const now = new Date();
      const minutesAgo = index * 5 + Math.floor(Math.random() * 30);
      const timestamp = new Date(now.getTime() - minutesAgo * 60000);
      
      logs.push({
        id: `log-${index}`,
        timestamp: timestamp.toLocaleTimeString('en-US', { hour12: false }),
        rule,
        status,
        message,
        details: status === 'success' ? `Synchronized ${Math.floor(Math.random() * 10) + 1} events` : 
                 status === 'error' ? 'Re-authorization required' : undefined
      });
    }
    
    return logs;
  }

  get filteredLogs(): LogEntry[] {
    return this.filter === 'all' ? this.logs : this.logs.filter(log => log.status === this.filter);
  }

  setFilter(filter: 'all' | 'success' | 'error' | 'warning'): void {
    this.filter = filter;
  }

  toggleDetails(logId: string): void {
    this.showDetails = this.showDetails === logId ? null : logId;
  }

  getFilterCount(filterType: 'all' | 'success' | 'error' | 'warning'): number {
    if (filterType === 'all') return this.logs.length;
    return this.logs.filter(log => log.status === filterType).length;
  }

  getFilterButtonClass(filterValue: string): string {
    const baseClass = 'px-3 py-1 text-sm rounded transition-all';
    return this.filter === filterValue
      ? `${baseClass} bg-white shadow text-gray-900`
      : `${baseClass} text-gray-600`;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'success': return 'check-circle';
      case 'error': return 'x-circle';
      case 'warning': return 'alert-triangle';
      default: return 'refresh-cw';
    }
  }

  getStatusIconClass(status: string): string {
    switch (status) {
      case 'success': return 'h-4 w-4 text-green-500';
      case 'error': return 'h-4 w-4 text-red-500';
      case 'warning': return 'h-4 w-4 text-yellow-500';
      default: return 'h-4 w-4 text-gray-500';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  }
}