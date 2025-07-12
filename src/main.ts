import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Calendar, User, CreditCard, Settings, FileText, Code, Plus, ArrowRight, Trash2, Play, Pause, Clock, MapPin, Users, CheckCircle, XCircle, AlertTriangle, RefreshCw, Filter, Loader, Save, Copy, Upload, Edit, Download, Check, X, Package, Sun, Moon, Monitor, AlertCircle } from 'lucide-angular';

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
        Sun,
        Moon,
        Monitor,
        AlertCircle
      })
    )
  ]
}).catch(err => console.error(err));