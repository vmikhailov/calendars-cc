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
  templateUrl: './rules.component.html'
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