import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Calendar, User, CreditCard, Settings, FileText, Code, Plus, ArrowRight, Trash2, Play, Pause, Clock, MapPin, Users, CheckCircle, XCircle, AlertTriangle, RefreshCw, Filter, Loader, Save, Copy, Upload, Edit, Download, Check, X, Sun, Moon, Monitor, AlertCircle } from 'lucide-angular';

// Configure Monaco Editor environment
(self as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    if (label === 'json') {
      return '/assets/monaco-editor/min/vs/language/json/json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return '/assets/monaco-editor/min/vs/language/css/css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return '/assets/monaco-editor/min/vs/language/html/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/assets/monaco-editor/min/vs/language/typescript/ts.worker.js';
    }
    return '/assets/monaco-editor/min/vs/editor/editor.worker.js';
  }
};

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      LucideAngularModule.pick({
        Calendar,
        User,
        CreditCard,
        Settings,
        FileText,
        Code,
        Plus,
        ArrowRight,
        Trash2,
        Play,
        Pause,
        Clock,
        MapPin,
        Users,
        CheckCircle,
        XCircle,
        AlertTriangle,
        RefreshCw,
        Filter,
        Loader,
        Save,
        Copy,
        Upload,
        Edit,
        Download,
        Check,
        X,
        Package,
        Package,
        Sun,
        Moon,
        Monitor,
        AlertCircle
      })
    )
  ]
}).catch(err => console.error(err));