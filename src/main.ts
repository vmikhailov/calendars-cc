import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Calendar, User, CreditCard, Settings, FileText, Code, Plus, ArrowRight, Trash2, Play, Pause, Clock, MapPin, Users, CheckCircle, XCircle, AlertTriangle, RefreshCw, Filter, Loader, Save, Copy, Upload, Edit, Download, Check, X, Package, Sun, Moon, Monitor, AlertCircle, CalendarDays, Info } from 'lucide-angular';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      MonacoEditorModule.forRoot(),
      LucideAngularModule.pick({
        Calendar,
        CalendarDays,
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
        Sun,
        Moon,
        Monitor,
        AlertCircle,
        Info
      })
    )
  ]
}).catch(err => console.error(err));