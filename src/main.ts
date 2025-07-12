import {bootstrapApplication} from '@angular/platform-browser';
import {importProvidersFrom} from '@angular/core';
import {AppComponent} from './app/app.component';
import {MonacoEditorModule} from 'ngx-monaco-editor-v2';
import {LucideAngularModule} from 'lucide-angular';
import {userIcons, statusIcons, actionIcons, navigationIcons, systemIcons} from './app/lucide-icons';

bootstrapApplication(AppComponent, {
    providers: [
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