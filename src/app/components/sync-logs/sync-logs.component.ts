import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { LogEntry } from '../../models/rule.model';

@Component({
  selector: 'app-sync-logs',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sync-logs.component.html'
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