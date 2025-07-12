import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { Subject, takeUntil } from 'rxjs';
import { RulesService } from '../../services/rules.service';
import { Rule } from '../../models/rule.model';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, MonacoEditorModule],
  template: `
    <div class="h-full flex">
      <!-- Rules List Sidebar -->
      <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-xl font-bold text-gray-900">Rules</h1>
              <p class="text-sm text-gray-600">Create and manage sync rules</p>
            </div>
            <button
              (click)="showNewRuleModal = true"
              class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <lucide-icon name="plus" class="h-4 w-4"></lucide-icon>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div
            *ngFor="let rule of rules"
            (click)="selectRule(rule)"
            [class]="getRuleCardClass(rule)"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center space-x-2">
                <div [class]="'status-dot ' + getStatusColor(rule.status)"></div>
                <h3 class="font-medium text-gray-900 text-sm">{{ rule.name }}</h3>
              </div>
              <div class="flex items-center space-x-1">
                <button
                  (click)="toggleRuleStatus(rule.id, $event)"
                  class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <lucide-icon 
                    [name]="rule.status === 'active' ? 'pause' : 'play'" 
                    class="h-3 w-3"
                  ></lucide-icon>
                </button>
                <button
                  (click)="duplicateRule(rule, $event)"
                  class="p-1 text-gray-400 hover:text-green-600 transition-colors"
                >
                  <lucide-icon name="copy" class="h-3 w-3"></lucide-icon>
                </button>
                <button
                  (click)="deleteRule(rule.id, $event)"
                  class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <lucide-icon name="trash-2" class="h-3 w-3"></lucide-icon>
                </button>
              </div>
            </div>
            
            <div>
              <p class="text-xs text-gray-600 mb-2">{{ rule.description }}</p>
            </div>
            
            <div class="flex items-center justify-between">
              <span [class]="'inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ' + getTypeColor(rule.type)">
                <lucide-icon [name]="getTypeIcon(rule.type)" class="h-3 w-3"></lucide-icon>
                <span class="capitalize">{{ rule.type }}</span>
              </span>
              <span class="text-xs text-gray-500">{{ rule.lastModified }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Editor Area -->
      <div class="flex-1 flex flex-col">
        <div *ngIf="selectedRule; else noRuleSelected">
          <!-- Editor Header -->
          <div class="bg-white border-b border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">{{ selectedRule.name }}</h2>
                <p class="text-sm text-gray-600 mt-1">{{ selectedRule.description }}</p>
              </div>
              <div class="flex items-center space-x-3">
                <button
                  *ngIf="isEditing"
                  (click)="cancelEdit()"
                  class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  (click)="isEditing ? saveRule() : startEdit()"
                  class="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <lucide-icon [name]="isEditing ? 'save' : 'code'" class="h-4 w-4"></lucide-icon>
                  <span>{{ isEditing ? 'Save' : 'Edit' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Monaco Editor -->
          <div class="flex-1 bg-gray-50">
            <ngx-monaco-editor
              class="w-full h-full"
              [(ngModel)]="editorContent"
              [options]="editorOptions"
              (onInit)="onEditorInit($event)"
            ></ngx-monaco-editor>
          </div>
        </div>

        <ng-template #noRuleSelected>
          <div class="flex-1 flex items-center justify-center bg-gray-50">
            <div class="text-center">
              <lucide-icon name="code" class="h-12 w-12 text-gray-300 mx-auto mb-4"></lucide-icon>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No Rule Selected</h3>
              <p class="text-gray-600">Select a rule from the sidebar to view and edit its code</p>
            </div>
          </div>
        </ng-template>
      </div>

      <!-- New Rule Modal -->
      <div *ngIf="showNewRuleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Create New Rule</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
              <input 
                type="text" 
                [(ngModel)]="newRule.name"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Custom Filter Rule"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                [(ngModel)]="newRule.description"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Describe what this rule does..."
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
              <select 
                [(ngModel)]="newRule.type"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="filter">Filter - Include/exclude events</option>
                <option value="transform">Transform - Modify event data</option>
                <option value="condition">Condition - Apply conditional logic</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              (click)="closeNewRuleModal()"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              (click)="createNewRule()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RulesComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  rules: Rule[] = [];
  selectedRule: Rule | null = null;
  isEditing = false;
  showNewRuleModal = false;
  editorContent = '';
  
  editorOptions = {
    theme: 'vs-light',
    language: 'javascript',
    readOnly: false,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on',
    tabSize: 2,
    insertSpaces: true,
  };

  newRule = {
    name: '',
    description: '',
    type: 'filter' as 'filter' | 'transform' | 'condition'
  };

  constructor(private rulesService: RulesService) {}

  ngOnInit(): void {
    this.rulesService.getRules()
      .pipe(takeUntil(this.destroy$))
      .subscribe(rules => {
        this.rules = rules;
      });

    this.rulesService.getSelectedRule()
      .pipe(takeUntil(this.destroy$))
      .subscribe(rule => {
        this.selectedRule = rule;
        this.updateEditorContent();
        this.updateEditorOptions();
      });
  }

  ngAfterViewInit(): void {
    // No longer needed with ngx-monaco-editor-v2
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateEditorContent(): void {
    if (this.selectedRule) {
      this.editorContent = this.selectedRule.code;
    }
  }

  private updateEditorOptions(): void {
    this.editorOptions = {
      ...this.editorOptions,
      readOnly: !this.isEditing
    };
  }

  onEditorContentChange(content: string): void {
    this.editorContent = content;
  }

  onEditorInit(editor: any): void {
    // Editor is ready
  }

  selectRule(rule: Rule): void {
    this.rulesService.selectRule(rule);
    this.isEditing = false;
    this.updateEditorContent();
    this.updateEditorOptions();
  }

  startEdit(): void {
    this.isEditing = true;
    this.updateEditorOptions();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.updateEditorContent();
    this.updateEditorOptions();
  }

  saveRule(): void {
    if (this.selectedRule) {
      const updatedRule: Rule = {
        ...this.selectedRule,
        code: this.editorContent
      };
      this.rulesService.updateRule(updatedRule);
      this.isEditing = false;
      this.updateEditorOptions();
    }
  }

  deleteRule(ruleId: string, event: Event): void {
    event.stopPropagation();
    this.rulesService.deleteRule(ruleId);
  }

  duplicateRule(rule: Rule, event: Event): void {
    event.stopPropagation();
    this.rulesService.duplicateRule(rule);
  }

  toggleRuleStatus(ruleId: string, event: Event): void {
    event.stopPropagation();
    this.rulesService.toggleRuleStatus(ruleId);
  }

  createNewRule(): void {
    const rule: Rule = {
      id: Date.now().toString(),
      name: this.newRule.name,
      description: this.newRule.description,
      type: this.newRule.type,
      status: 'draft',
      lastModified: new Date().toLocaleString(),
      code: `// ${this.newRule.name}
function ${this.newRule.type}Rule(event) {
  // Add your ${this.newRule.type} logic here
  return event;
}

// Apply ${this.newRule.type}
return ${this.newRule.type}Rule(event);`
    };

    this.rulesService.updateRule(rule);
    this.rulesService.selectRule(rule);
    this.closeNewRuleModal();
  }

  closeNewRuleModal(): void {
    this.showNewRuleModal = false;
    this.newRule = {
      name: '',
      description: '',
      type: 'filter'
    };
  }

  getRuleCardClass(rule: Rule): string {
    const baseClass = 'p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm';
    return this.selectedRule?.id === rule.id
      ? `${baseClass} border-blue-500 bg-blue-50`
      : `${baseClass} border-gray-200 hover:border-gray-300 hover:bg-gray-50`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'filter': return 'file-text';
      case 'transform': return 'settings';
      case 'condition': return 'code';
      default: return 'code';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'filter': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'transform': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'condition': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  }
}