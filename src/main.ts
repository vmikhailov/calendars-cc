import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { LucideAngularModule } from 'lucide-angular';
import { userIcons, statusIcons, actionIcons, navigationIcons, systemIcons } from './app/lucide-icons';
import { provideHttpClient } from '@angular/common/http';
import { apiProviders } from "./app/api-services/api-providers";
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideRouter(routes),
        ...apiProviders,
        importProvidersFrom(
            MonacoEditorModule.forRoot(),
            LucideAngularModule.pick({
                ...userIcons,
                ...statusIcons,
                ...actionIcons,
                ...navigationIcons,
                ...systemIcons,
            })
        )
    ]
}).catch(err => console.error(err));